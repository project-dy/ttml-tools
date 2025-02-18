export function saveAsFile(filename: string, content: string) {
  // Blob 객체 생성
  const blob = new Blob([content], { type: "text/plain" }); // 예시: 텍스트 파일

  // Blob URL 생성
  const url = URL.createObjectURL(blob);

  // a 요소 생성
  const a = document.createElement("a");
  a.href = url;
  a.download = filename; // 파일 이름 지정

  // a 요소 클릭 이벤트 발생
  a.click();

  // URL 해제
  URL.revokeObjectURL(url);
}
