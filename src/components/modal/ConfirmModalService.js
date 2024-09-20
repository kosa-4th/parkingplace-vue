import { ref } from "vue";

// 
export const modalState = ref({
    isVisible: false,
    title: '',
    message: '',
    confirm: false,
    error: false,
    path: ''
});

// 초록 모달 화면 / only 확인 버튼
export function showConfirmModal(message = null, path = '', title = '알림') {
    modalState.value = {
        isVisible : true,
        title,
        message: message || '작업이 완료되었습니다.',
        confirm: true,
        error: false,
        path
    }
}

// 빨간 모달 화면 / only 확인 버튼
export function showErrorModal(message = null, path = '', title = '알림' ) {
    modalState.value = {
        isVisible : true,
        title,
        message: message || '에러가 발생했습니다.',
        confirm: false,
        error: true,
        path
    }
}

// 노란 모달 화면 / only 확인 버튼
export function showInfoModal(message = null, path = '', title = '알림' ) {
    modalState.value = {
        isVisible : true,
        title,
        message: message || '다시 확인해주세요.',
        confirm: false,
        error: false,
        path
    }
}

// 모달 창 닫기
export function handleCloseModal() {
    modalState.value.confirm = false;
    modalState.value.error = false;
    modalState.value.isVisible = false;
}


/////////////////////////////////////

// 확인 취소 모달 사용
export const confirmCancelModalState = ref({
    isVisible: false,
    title: '',
    message: '',
    confirm: true,
    error: false,
    path: ''
});

export function showConfirmCancelModal(message=null, path='', title="알림") {
    confirmCancelModalState.value = {
        isVisible: true,
        title,
        message: message || '작업이 완료되었습니다.',
        confirm: true,
        error: false,
        path
    }
}

export function showCCErrorModal(message=null, path='', title="알림") {
    confirmCancelModalState.value = {
        isVisible: true,
        title,
        message: message || '에러가 발생했습니다.',
        confirm: false,
        error: true,
        path
    }
}

export function showCCInfoModal(message=null, path='', title="알림") {
    confirmCancelModalState.value = {
        isVisible: true,
        title,
        message: message || '정말로 진행하시겠습니까?',
        confirm: false,
        error: false,
        path
    }
}

export function handleColseCCModal() {
    confirmCancelModalState.value.isVisible = false;
}

// 확인은 각 페이지에서 만들어야하나
// export function handleActionCCModal(callback) {

// }