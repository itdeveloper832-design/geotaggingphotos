/**
 * EXIF Parser Utility
 * Reads real EXIF metadata & GPS coordinates directly from image file binaries on client-side.
 */

function parsePhotoExifData(file, callback) {
    if (!file) {
        callback(null, "No file provided");
        return;
    }

    if (typeof EXIF === 'undefined') {
        callback(null, "EXIF.js library not loaded");
        return;
    }

    EXIF.getData(file, function () {
        const allTags = EXIF.getAllTags(this);

        // GPS extraction
        const latArray = EXIF.getTag(this, "GPSLatitude");
        const latRef = EXIF.getTag(this, "GPSLatitudeRef");
        const lngArray = EXIF.getTag(this, "GPSLongitude");
        const lngRef = EXIF.getTag(this, "GPSLongitudeRef");
        const alt = EXIF.getTag(this, "GPSAltitude");

        let latDecimal = null;
        let lngDecimal = null;

        if (latArray && latArray.length >= 3 && latRef) {
            latDecimal = convertDmsToDecimal(latArray, latRef);
        }

        if (lngArray && lngArray.length >= 3 && lngRef) {
            lngDecimal = convertDmsToDecimal(lngArray, lngRef);
        }

        let altitudeMeters = null;
        if (alt !== undefined && alt !== null) {
            altitudeMeters = (alt.numerator && alt.denominator) ? (alt.numerator / alt.denominator).toFixed(1) : parseFloat(alt).toFixed(1);
        }

        // Camera Metadata Extraction
        const make = EXIF.getTag(this, "Make") || "Unknown";
        const model = EXIF.getTag(this, "Model") || "Unknown";
        const lens = EXIF.getTag(this, "LensModel") || EXIF.getTag(this, "Undefined") || "Standard Lens";

        let focalLength = EXIF.getTag(this, "FocalLength");
        if (focalLength && focalLength.numerator) focalLength = (focalLength.numerator / focalLength.denominator).toFixed(1);
        focalLength = focalLength ? `${focalLength} mm` : "N/A";

        let aperture = EXIF.getTag(this, "FNumber") || EXIF.getTag(this, "ApertureValue");
        if (aperture && aperture.numerator) aperture = (aperture.numerator / aperture.denominator).toFixed(1);
        aperture = aperture ? `f/${aperture}` : "N/A";

        let shutter = EXIF.getTag(this, "ExposureTime");
        if (shutter && shutter.numerator) {
            shutter = (shutter.numerator === 1) ? `1/${Math.round(shutter.denominator / shutter.numerator)} sec` : `${(shutter.numerator / shutter.denominator).toFixed(3)} sec`;
        } else {
            shutter = shutter ? `${shutter} sec` : "N/A";
        }

        const iso = EXIF.getTag(this, "ISOSpeedRatings") || EXIF.getTag(this, "ISO") || "N/A";
        const dateTaken = EXIF.getTag(this, "DateTimeOriginal") || EXIF.getTag(this, "DateTime") || "N/A";

        callback({
            hasGps: (latDecimal !== null && lngDecimal !== null),
            latitude: latDecimal,
            longitude: lngDecimal,
            altitude: altitudeMeters ? `${altitudeMeters}m` : "N/A",
            latFormatted: latDecimal !== null ? `${Math.abs(latDecimal).toFixed(6)}° ${latDecimal >= 0 ? 'N' : 'S'}` : "Not Found",
            lngFormatted: lngDecimal !== null ? `${Math.abs(lngDecimal).toFixed(6)}° ${lngDecimal >= 0 ? 'E' : 'W'}` : "Not Found",
            make: String(make).trim(),
            model: String(model).trim(),
            lens: String(lens).trim(),
            focalLength: focalLength,
            aperture: aperture,
            shutter: shutter,
            iso: String(iso),
            dateTaken: String(dateTaken),
            rawTags: allTags
        }, null);
    });
}

function convertDmsToDecimal(dmsArray, ref) {
    if (!dmsArray || dmsArray.length < 3) return null;

    let deg = (dmsArray[0].numerator && dmsArray[0].denominator) ? dmsArray[0].numerator / dmsArray[0].denominator : Number(dmsArray[0]);
    let min = (dmsArray[1].numerator && dmsArray[1].denominator) ? dmsArray[1].numerator / dmsArray[1].denominator : Number(dmsArray[1]);
    let sec = (dmsArray[2].numerator && dmsArray[2].denominator) ? dmsArray[2].numerator / dmsArray[2].denominator : Number(dmsArray[2]);

    let decimal = deg + (min / 60) + (sec / 3600);
    if (ref === "S" || ref === "W") {
        decimal = -decimal;
    }
    return decimal;
}
