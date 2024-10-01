/* 
 담당자: 양건모
 시작 일자: 2024.09.02
 설명 : 기본 루트
 ---------------------
 2024.09.02 양건모 | 루트 작성, 등록
 2024.09.11 김경민 | 예약 및 결제 관련 라우터 추가
 2024.09.11 양건모 | reservation 관련 path 변경
 2024.09.26 양건모 | 수익 통계 페이지 삭제
 */

import OwnerCmp from '@/components/contents/owner/OwnerCmp.vue'
import OwnerLotCmp from '@/components/contents/owner/OwnerLotCmp.vue'
import OwnerMainCmp from '@/components/contents/owner/OwnerMainCmp.vue'
import OwnerQnaCmp from '@/components/contents/owner/OwnerQnaCmp.vue'
import OwnerReservationCmp from '@/components/contents/owner/OwnerReservationCmp.vue'
import LoginCmp from '@/components/contents/user/LoginCmp.vue'
import LotDetailCmp from '@/components/contents/user/lot/LotDetailCmp.vue'
import LotDetailHomeCmp from '@/components/contents/user/lot/LotDetailHomeCmp.vue'
import LotDetailQnaListCmp from '@/components/contents/user/lot/LotDetailQnaListCmp.vue'
import LotDetailReviewCmp from '@/components/contents/user/lot/LotDetailReviewCmp.vue'
import LotDetailDoQnaCmp from '@/components/contents/user/lot/LotDetailDoQnaCmp.vue'
import UserMapCmp from '@/components/contents/user/map/UserMapCmp.vue'
import MyAccontCmp from '@/components/contents/user/my/MyAccontCmp.vue'
import MyCarsCmp from '@/components/contents/user/my/MyCarsCmp.vue'
import MyCmp from '@/components/contents/user/my/MyCmp.vue'
import MyFavoritesCmp from '@/components/contents/user/my/MyFavoritesCmp.vue'
import MyReservationsCmp from '@/components/contents/user/my/MyReservationsCmp.vue'
import MyReviewsCmp from '@/components/contents/user/my/MyReviewsCmp.vue'
import RegisterCmp from '@/components/contents/user/RegisterCmp.vue'
import ReservationCmp from '@/components/contents/user/ReservationCmp.vue'
import UserCmp from '@/components/contents/user/UserCmp.vue'
import ManagerCmp from '@/components/contents/manager/ManagerCmp.vue'
import ReservationDetailCmp from '@/components/contents/user/reservation/ReservationDetailCmp.vue'
import MyReservationDetailCmp from '@/components/contents/user/my/MyReservationDetailCmp.vue'
import PageNotFound from '@/components/modal/PageNotFound.vue'
import MyInquiriesCmp from '@/components/contents/user/my/MyInquiriesCmp.vue'
import ManagerUserCmp from '@/components/contents/manager/ManagerUserCmp.vue'
import ManagerLotCmp from '@/components/contents/manager/ManagerLotCmp.vue'
import OwnerReviewCmp from '@/components/contents/owner/OwnerReviewCmp.vue'
import MyInquiryCmp from '@/components/contents/user/my/MyInquiryCmp.vue'
import OwnerGraphCmp from '@/components/contents/owner/OwnerGraphCmp.vue'

export default [
  {
    path: '/',
    component: UserCmp,
    children: [
      {
        path: '',
        component: UserMapCmp
      },
      {
        path: 'login',
        component: LoginCmp
      },
      {
        path: 'register',
        component: RegisterCmp
      },
      {
        path: 'lot/:lotId',
        component: LotDetailCmp,
        props: true,
        redirect: (to) => `/lot/${to.params.lotId}/home`,
        children: [
          {
            path: 'home',
            component: LotDetailHomeCmp
          },
          {
            path: 'review',
            component: LotDetailReviewCmp
          },
          {
            path: 'inquiry',
            component: LotDetailQnaListCmp
          },
          {
            path: 'make-inquiry',
            component: LotDetailDoQnaCmp
          },
          {
            path: 'make-inquiry/:inquiryId',
            component: LotDetailDoQnaCmp,
            props: true
          }
        ]
      },
      {
        path: 'reservation/:lotId',
        component: ReservationCmp,
        props: true
      },
      {
        path: 'reservation/detail/:reservationId',
        component: ReservationDetailCmp,
        props: true
      },
      {
        path: 'my',
        component: MyCmp,
        children: [
          {
            path: '',
            component: MyAccontCmp
          },
          {
            path: 'cars',
            component: MyCarsCmp
          },
          {
            path: 'reservations',
            component: MyReservationsCmp
          },
          {
            path: 'reservations/:reservationId',
            component: MyReservationDetailCmp
          },
          {
            path: 'favorites',
            component: MyFavoritesCmp
          },
          {
            path: 'reviews',
            component: MyReviewsCmp
          },
          {
            path: 'inquiries',
            component: MyInquiriesCmp,
          },
          {
            path: 'inquiries/:inquiryId',
            component: MyInquiryCmp
          }
        ]
      }
    ]
  },
  {
    path: '/owner',
    component: OwnerCmp,
    children: [
      {
        path: '',
        component: OwnerMainCmp
      },
      {
        path: 'lots',
        component: OwnerLotCmp
      },
      {
        path: 'reservations',
        component: OwnerReservationCmp
      },
      {
        path: 'qna',
        component: OwnerQnaCmp
      },
      {
        path: 'reviews',
        component: OwnerReviewCmp
      },
      {
        path: 'graph',
        component: OwnerGraphCmp
      }
    ]
  },
  {
    path: '/manager',
    component: ManagerCmp,
    children: [
      {
        path: '',
        component: ManagerUserCmp
      },
      {
        path: '/lot',
        component: ManagerLotCmp
      }
    ]
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404'
  },
  {
    path: '/404',
    component: PageNotFound
  }
]
