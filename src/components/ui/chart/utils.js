/**
 * @file utils.js
 * @description Helper utility for extracting configuration from Recharts payloads.
 */

export function getPayloadConfigFromPayload(config, payload, key) {
    if (typeof payload !== "object" || payload === null) return undefined;

    const pPayload = "payload" in payload && typeof payload.payload === "object" && payload.payload !== null ? payload.payload : undefined;
    let labelKey = key

    if (key in payload && typeof payload[key] === "string") {
        labelKey = payload[key]
    } else if (pPayload && key in pPayload && typeof pPayload[key] === "string") {
        labelKey = pPayload[key]
    }

    return labelKey in config ? config[labelKey] : config[key];
}
