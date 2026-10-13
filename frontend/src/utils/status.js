const STYLE = {
    danger: {
        level: "danger",
        bg: "bg-red-50 hover:bg-red-100",
        text: "text-red-700",
        border: "border-red-300"
    },
    warning: {
        level: "warning",
        bg: "bg-amber-50 hover:bg-amber-100",
        text: "text-amber-700",
        border: "border-amber-300"
    },
    normal: {
        level: "normal",
        bg: "bg-emerald-50 hover:bg-emerald-100",
        text: "text-emerald-700",
        border: "border-emerald-300"
    }
};

// 기준값 (필요하면 여기 숫자만 바꾸면 됨)
const TEMP_DANGER_LOW = 5;     // 이하: 동파 위험
const TEMP_WARN_LOW = 10;      // 이하: 저온 주의
const TEMP_WARN_HIGH = 30;     // 이상: 고온 주의
const TEMP_DANGER_HIGH = 35;   // 이상: 고온 위험
const HUM_WARN = 70;           // 이상: 습도 주의
const HUM_DANGER = 90;         // 이상: 누수 의심(위험)

export function getStatusInfo(temp, humidity, airQuality) {

    // ---- 위험 ----
    if (temp <= TEMP_DANGER_LOW) {
        return { label: "🚨 동파 위험", ...STYLE.danger };
    }

    if (temp >= TEMP_DANGER_HIGH) {
        return { label: "🚨 고온 위험", ...STYLE.danger };
    }

    if (humidity >= HUM_DANGER) {
        return { label: "🚨 누수 의심", ...STYLE.danger };
    }

    // ---- 경고(주의) ----
    if (temp >= TEMP_WARN_HIGH) {
        return { label: "⚠ 고온 주의", ...STYLE.warning };
    }

    if (temp <= TEMP_WARN_LOW) {
        return { label: "⚠ 저온 주의", ...STYLE.warning };
    }

    if (humidity >= HUM_WARN) {
        return { label: "⚠ 습도 주의", ...STYLE.warning };
    }

    if (airQuality === "나쁨") {
        return { label: "⚠ 악취 발생", ...STYLE.warning };
    }

    return { label: "🟢 정상", ...STYLE.normal };

}

export function getOnlineStatus(createdAt) {

    if (!createdAt) {

        return {
            online: false,
            label: "🔴 Offline",
            color: "text-red-600"
        };

    }

    const last = new Date(createdAt.replace(" ", "T") + "Z");
    const now = new Date();

    const diff = (now - last) / 1000;

    if (diff <= 30) {

        return {
            online: true,
            label: "🟢 Online",
            color: "text-emerald-600"
        };

    }

    return {
        online: false,
        label: "🔴 Offline",
        color: "text-red-600"
    };

}

// Shared display metadata for a bare status level ("normal" | "warning" |
// "danger"), reusing the same color language as getStatusInfo(). Used by
// aggregate views (e.g. the building selector) that need to show a status
// without recomputing it from raw sensor values.
const LEVEL_META = {
    normal: {
        label: "🟢 정상",
        text: "text-emerald-700",
        bg: "bg-emerald-100",
        border: "border-emerald-300",
        dot: "bg-emerald-500"
    },
    warning: {
        label: "⚠ 경고",
        text: "text-amber-700",
        bg: "bg-amber-100",
        border: "border-amber-300",
        dot: "bg-amber-500"
    },
    danger: {
        label: "🚨 위험",
        text: "text-red-700",
        bg: "bg-red-100",
        border: "border-red-300",
        dot: "bg-red-500"
    }
};

export function getLevelMeta(level) {
    return LEVEL_META[level] ?? LEVEL_META.normal;
}