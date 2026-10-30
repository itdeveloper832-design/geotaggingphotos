/**
 * GeotagEXIF Utility
 * Embeds real binary EXIF GPS & Advanced Metadata (Title, Description, Keywords, Author, Altitude, Heading)
 * directly into JPEG images client-side before downloading.
 */

function convertDegToExifRational(deg) {
    const absolute = Math.abs(deg);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.round((minutesNotTruncated - minutes) * 60 * 10000);
    return [[degrees, 1], [minutes, 1], [seconds, 10000]];
}

function convertToExifUCS2(str) {
    if (!str) return [];
    const ucs2 = [];
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        ucs2.push(code & 0xff);
        ucs2.push((code >> 8) & 0xff);
    }
    // Null termination (2 bytes)
    ucs2.push(0, 0);
    return ucs2;
}

function buildGpsExifData(latNum, lngNum, options = {}) {
    const zeroDict = {};
    const exifDict = {};
    const gpsDict = {};

    if (!options.removeGps && !isNaN(latNum) && !isNaN(lngNum)) {
        const latRef = latNum >= 0 ? "N" : "S";
        const lngRef = lngNum >= 0 ? "E" : "W";

        gpsDict[piexif.GPSIFD.GPSVersionID] = [2, 2, 0, 0];
        gpsDict[piexif.GPSIFD.GPSLatitudeRef] = latRef;
        gpsDict[piexif.GPSIFD.GPSLatitude] = convertDegToExifRational(latNum);
        gpsDict[piexif.GPSIFD.GPSLongitudeRef] = lngRef;
        gpsDict[piexif.GPSIFD.GPSLongitude] = convertDegToExifRational(lngNum);

        // Optional Altitude
        if (options.altitude !== undefined && options.altitude !== "" && !isNaN(parseFloat(options.altitude))) {
            const altNum = parseFloat(options.altitude);
            gpsDict[piexif.GPSIFD.GPSAltitudeRef] = altNum < 0 ? 1 : 0;
            gpsDict[piexif.GPSIFD.GPSAltitude] = [Math.round(Math.abs(altNum) * 100), 100];
        }

        // Optional Heading / Direction
        if (options.heading !== undefined && options.heading !== "" && !isNaN(parseFloat(options.heading))) {
            const headNum = parseFloat(options.heading);
            gpsDict[piexif.GPSIFD.GPSImgDirectionRef] = "T";
            gpsDict[piexif.GPSIFD.GPSImgDirection] = [Math.round(Math.abs(headNum) * 100), 100];
        }

        // Optional Accuracy
        if (options.accuracy !== undefined && options.accuracy !== "" && !isNaN(parseFloat(options.accuracy))) {
            const accNum = parseFloat(options.accuracy);
            gpsDict[piexif.GPSIFD.GPSHPositioningError] = [Math.round(Math.abs(accNum) * 100), 100];
        }
    }

    // Optional Title
    if (options.title && options.title.trim() !== "") {
        zeroDict[piexif.ImageIFD.XPTitle] = convertToExifUCS2(options.title.trim());
        zeroDict[piexif.ImageIFD.DocumentName] = options.title.trim();
    }

    // Optional Description
    if (options.description && options.description.trim() !== "") {
        zeroDict[piexif.ImageIFD.ImageDescription] = options.description.trim();
        zeroDict[piexif.ImageIFD.XPSubject] = convertToExifUCS2(options.description.trim());
    }

    // Optional Keywords / Tags
    if (options.keywords) {
        const kwStr = Array.isArray(options.keywords) ? options.keywords.join(", ") : options.keywords;
        if (kwStr.trim() !== "") {
            zeroDict[piexif.ImageIFD.XPKeywords] = convertToExifUCS2(kwStr.trim());
        }
    }

    // Optional Author / Artist
    if (options.artist && options.artist.trim() !== "") {
        zeroDict[piexif.ImageIFD.Artist] = options.artist.trim();
        zeroDict[piexif.ImageIFD.XPAuthor] = convertToExifUCS2(options.artist.trim());
    }

    // Optional Copyright
    if (options.copyright && options.copyright.trim() !== "") {
        zeroDict[piexif.ImageIFD.Copyright] = options.copyright.trim();
    }

    // Optional Software branding
    zeroDict[piexif.ImageIFD.Software] = "GeoTaggingPhotos.com EXIF Suite";

    // Optional Capture Date/Time
    if (options.captureTime && options.captureTime.trim() !== "") {
        // Expected format: YYYY:MM:DD HH:MM:SS
        let formattedTime = options.captureTime.trim().replace(/-/g, ":").replace("T", " ");
        if (formattedTime.length === 16) formattedTime += ":00";
        exifDict[piexif.ExifIFD.DateTimeOriginal] = formattedTime;
        exifDict[piexif.ExifIFD.DateTimeDigitized] = formattedTime;
    }

    const exifObj = {
        "0th": zeroDict,
        "Exif": exifDict,
        "GPS": gpsDict,
        "1st": {},
        "thumbnail": null
    };

    return piexif.dump(exifObj);
}

function geotagImageAndDownload(imageSrcUrl, fileName, lat, lng, options = {}) {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (!options.removeGps && (isNaN(latNum) || isNaN(lngNum))) {
        alert("Please specify valid latitude and longitude coordinates before downloading.");
        return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        let jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);

        if (typeof piexif !== 'undefined') {
            try {
                const exifBytes = buildGpsExifData(latNum, lngNum, options);
                jpegDataUrl = piexif.insert(exifBytes, jpegDataUrl);
                console.log("✓ Successfully embedded EXIF GPS & metadata into JPEG binary.");
            } catch (err) {
                console.error("EXIF metadata insertion error:", err);
            }
        } else {
            console.warn("piexifjs library not detected; downloading standard image.");
        }

        let finalFileName = fileName;
        if (options.customFileName && options.customFileName.trim() !== "") {
            finalFileName = options.customFileName.trim();
            if (!/\.(jpg|jpeg)$/i.test(finalFileName)) {
                finalFileName += ".jpg";
            }
        } else if (!options.keepOriginalName) {
            const nameParts = fileName.split('.');
            if (nameParts.length > 1) nameParts.pop();
            const baseName = nameParts.join('.');
            if (options.removeGps) {
                finalFileName = `${baseName}_cleared.jpg`;
            } else {
                finalFileName = `${baseName}_geotagged_${latNum.toFixed(4)}_${lngNum.toFixed(4)}.jpg`;
            }
        }

        const a = document.createElement('a');
        a.href = jpegDataUrl;
        a.download = finalFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    img.src = imageSrcUrl;
}

/**
 * Reverse Geocode helper via OpenStreetMap Nominatim
 */
async function reverseGeocodeCoordinates(lat, lng) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=18&addressdetails=1`, {
            headers: { 'Accept-Language': 'en' }
        });
        if (!response.ok) throw new Error("Reverse geocoding network response was not ok");
        const data = await response.json();
        if (!data || !data.address) return null;

        const addr = data.address;
        return {
            country: addr.country || "",
            state: addr.state || addr.region || addr.province || "",
            city: addr.city || addr.town || addr.village || addr.suburb || "",
            address: [addr.road, addr.house_number, addr.postcode].filter(Boolean).join(", ") || data.display_name || ""
        };
    } catch (err) {
        console.warn("Reverse geocode failed:", err);
        return null;
    }
}
