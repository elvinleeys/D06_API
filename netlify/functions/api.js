// Netlify Function: 공공데이터포털 API 키를 서버에서만 쓴다.
// 주의: API 키는 절대 HTML·JS·빌드 결과물(VITE_ 변수 포함)에 넣지 않는다. 브라우저로 간 값은 모두 공개된다.
// 키는 Netlify 환경변수(WEATHER_SERVICE_KEY)에만 두고, 이 함수가 호출 때 붙여서 전달한다.
//   /api/config   -> { githubUser }  (GITHUB_USER, 비밀 아님)
//   /api/data/... -> https://apis.data.go.kr/... (허용한 주소만, serviceKey는 여기서 붙임)
const ALLOW = [ // 이 화면이 쓰는 주소만 허용한다. 그 밖의 공공데이터 API에 내 키가 쓰이지 않게 한다
  "1360000/VilageFcstInfoService_2.0/getVilageFcst",
  "1360000/LivingWthrIdxServiceV5/getUVIdxV5",
  "1360000/HealthWthrIdxServiceV3/getOakPollenRiskIdxV3",
  "1360000/HealthWthrIdxServiceV3/getPinePollenRiskIdxV3",
  "1360000/HealthWthrIdxServiceV3/getWeedsPollenRiskndxV3",
  "B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty",
];
const json = (code, obj, cache = "no-store") => ({ statusCode: code, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": cache }, body: JSON.stringify(obj) });

exports.handler = async event => {
  if (event.httpMethod !== "GET") return json(405, { error: "GET만 지원해요" });
  const rest = (event.path.match(/\/(?:api|\.netlify\/functions\/api)\/(.*)$/) || [])[1] ?? "";
  if (rest === "config") return json(200, { githubUser: process.env.GITHUB_USER || "" });
  if (!rest.startsWith("data/")) return json(404, { error: "Not found" });

  const target = decodeURIComponent(rest.slice(5));
  if (!ALLOW.includes(target)) return json(403, { error: "허용하지 않는 주소예요" });
  const key = process.env.WEATHER_SERVICE_KEY;
  if (!key) return json(200, { response: { header: { resultCode: "KEY", resultMsg: "Netlify 환경변수 WEATHER_SERVICE_KEY가 없어요" } } }); // 화면의 resultCode 검사에서 그대로 보인다

  const q = new URLSearchParams(event.rawQuery || "");
  q.set("serviceKey", key); // 브라우저가 보낸 값은 덮어쓴다
  try {
    const r = await fetch(`https://apis.data.go.kr/${target}?${q}`);
    return { statusCode: r.status, headers: { "Content-Type": r.headers.get("content-type") || "application/json", "Cache-Control": "public, max-age=300" }, body: await r.text() };
  } catch (e) {
    return json(502, { error: "공공데이터포털에 연결하지 못했어요" }); // 오류 문구에 주소·키가 섞이지 않게 일부러 일반 문구만 쓴다
  }
};
