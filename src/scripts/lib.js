// 작성자: 오지수, 숫자를 돈 모양으로 변환해주는 메서드
export default {
    getNumberFormatted(val) {
      if (val === undefined || val === null) {
        return ''; // 값이 없을 때 빈 문자열 반환
      }
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');    }
  }