import OwnerCmp from '@/components/contents/owner/OwnerCmp.vue'
import OwnerIncomeCmp from '@/components/contents/owner/OwnerIncomeCmp.vue'
import OwnerLotCmp from '@/components/contents/owner/OwnerLotCmp.vue'
import OwnerMainCmp from '@/components/contents/owner/OwnerMainCmp.vue'
import OwnerQnaCmp from '@/components/contents/owner/OwnerQnaCmp.vue'
import OwnerReservationCmp from '@/components/contents/owner/OwnerReservationCmp.vue'
import LoginCmp from '@/components/contents/user/LoginCmp.vue'
import LotDetailCmp from '@/components/contents/user/lot/LotDetailCmp.vue'
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
import ManagerCmp from '@/components/manager/ManagerCmp.vue'

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
        path: 'lot/{lotid}?',
        component: LotDetailCmp,
        props: true
      },
      {
        path: 'reservation/{lotid}?',
        component: ReservationCmp,
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
            path: 'favorites',
            component: MyFavoritesCmp
          },
          {
            path: 'reviews',
            component: MyReviewsCmp
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
        path: 'incomes',
        component: OwnerIncomeCmp
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
      }
    ]
  },
  {
    path: '/manager',
    component: ManagerCmp
  }
]
