const STYLE = {
  danger: {
    level: "danger",
    bg: "bg-red-50 hover:bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
  },
  warning: {
    level: "warning",
    bg: "bg-amber-50 hover:bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-300",
  },
  normal: {
    level: "normal",
    bg: "bg-emerald-50 hover:bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-300",
  },
};

// 기준값 (필요하면 여기 숫자만 바꾸면 됨)
const TEMP_DANGER_LOW = 5; // 이하: 동파 위험
const TEMP_WARN_LOW = 10; // 이하: 저온 주의
const TEMP_WARN_HIGH = 30; // 이상: 고온 주의
const TEMP_DANGER_HIGH = 35; // 이상: 고온 위험
const HUM_WARN = 70; // 이상: 습도 주의
const HUM_DANGER = 90; // 이상: 누수 의심(위험)
const AIR_WARN = 250; // 이상: 악취 주의 (MQ-135 숫자값, 실측 후 조정)
const AIR_DANGER = 400; // 이상: 악취 위험 (MQ-135 숫자값, 실측 후 조정)

export function getStatusInfo(temp, humidity, airQuality) {
  // DB에서 공기질이 문자열("183")로 오므로 숫자로 변환
  // ("나쁨" 같은 글자는 NaN이 되어 숫자 비교에 걸리지 않음)
  const air = Number(airQuality);

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

  if (air >= AIR_DANGER) {
    return { label: "🚨 악취 위험", ...STYLE.danger };
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

  if (air >= AIR_WARN || airQuality === "나쁨") {
    return { label: "⚠ 악취 주의", ...STYLE.warning };
  }

  return { label: "🟢 정상", ...STYLE.normal };
}

export function getOnlineStatus(createdAt) {
  if (!createdAt) {
    return {
      online: false,
      label: "🔴 Offline",
      color: "text-red-600",
    };
  }

  // 서버 시간이 한국 시간(KST)이므로 "Z"(UTC 표시)를 붙이지 않는다.
  // 브라우저 시간대가 한국일 때 정확하다.
  const last = new Date(createdAt.replace(" ", "T"));
  const now = new Date();

  const diff = (now - last) / 1000;

  if (diff <= 30) {
    return {
      online: true,
      label: "🟢 Online",
      color: "text-emerald-600",
    };
  }

  return {
    online: false,
    label: "🔴 Offline",
    color: "text-red-600",
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
    dot: "bg-emerald-500",
  },
  warning: {
    label: "⚠ 경고",
    text: "text-amber-700",
    bg: "bg-amber-100",
    border: "border-amber-300",
    dot: "bg-amber-500",
  },
  danger: {
    label: "🚨 위험",
    text: "text-red-700",
    bg: "bg-red-100",
    border: "border-red-300",
    dot: "bg-red-500",
  },
};

export function getLevelMeta(level) {
  return LEVEL_META[level] ?? LEVEL_META.normal;
}
