import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './features/public/home/home.component';
import { DashboardOverviewComponent } from './features/dashboard/dashboard-overview.component';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SettingsComponent } from './features/profile/settings.component';
import { FavoritesComponent } from './features/profile/favorites.component';
import { MyListingsComponent } from './features/landlord/my-listings.component';
import { CreateListingComponent } from './features/landlord/create-listing.component';
import { ListingDetailComponent } from './features/landlord/listing-detail.component';
import { AdminOverviewComponent } from './features/admin/admin-overview.component';
import { AdminListingsComponent } from './features/admin/admin-listings.component';
import { AdminListingDetailComponent } from './features/admin/admin-listing-detail.component';
import { AdminUsersComponent } from './features/admin/admin-users.component';
import { AdminKycComponent } from './features/admin/admin-kyc.component';
import { AdminKycDetailComponent } from './features/admin/admin-kyc-detail.component';
import { AdminAuditComponent } from './features/admin/admin-audit.component';
import { KycComponent } from './features/verification/kyc.component';
import { SearchComponent } from './features/search/search.component';
import { SearchListingDetailComponent } from './features/search/search-listing-detail.component';
import { RenterBookingsComponent } from './features/booking/renter-bookings.component';
import { LandlordBookingsComponent } from './features/booking/landlord-bookings.component';
import { BookingDetailComponent } from './features/booking/booking-detail.component';
import { PaymentCheckoutComponent } from './features/payment/payment-checkout.component';
import { PaymentHistoryComponent } from './features/payment/payment-history.component';
import { ChatInboxComponent } from './features/chat/chat-inbox.component';
import { ChatThreadComponent } from './features/chat/chat-thread.component';
import { NotificationListComponent } from './features/notification/notification-list.component';
import { NotFoundComponent } from './features/public/not-found/not-found.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'search', component: SearchComponent },
      { path: 'search/:id', component: SearchListingDetailComponent },
      { path: 'listings', redirectTo: '/search', pathMatch: 'full' },
      { path: 'listings/create', redirectTo: '/dashboard/listings/create', pathMatch: 'full' },
      { path: 'listings/:id', redirectTo: '/dashboard/listings/:id' },
      { path: 'verification', component: KycComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ROLE_RENTER', 'ROLE_LANDLORD'] } },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
      { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
      { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ROLE_RENTER'] } },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_RENTER', 'ROLE_LANDLORD'] },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: DashboardOverviewComponent },
      { path: 'listings', component: MyListingsComponent, canActivate: [roleGuard], data: { roles: ['ROLE_LANDLORD'] } },
      { path: 'listings/create', component: CreateListingComponent, canActivate: [roleGuard], data: { roles: ['ROLE_LANDLORD'] } },
      { path: 'listings/:id', component: ListingDetailComponent, canActivate: [roleGuard], data: { roles: ['ROLE_LANDLORD'] } },
      { path: 'bookings', component: RenterBookingsComponent, canActivate: [roleGuard], data: { roles: ['ROLE_RENTER'] } },
      { path: 'bookings/:id', component: BookingDetailComponent, canActivate: [roleGuard], data: { roles: ['ROLE_RENTER', 'ROLE_LANDLORD'] } },
      { path: 'requests', component: LandlordBookingsComponent, canActivate: [roleGuard], data: { roles: ['ROLE_LANDLORD'] } },
      { path: 'payments', component: PaymentHistoryComponent, canActivate: [roleGuard], data: { roles: ['ROLE_RENTER'] } },
      { path: 'payments/:bookingId/checkout', component: PaymentCheckoutComponent, canActivate: [roleGuard], data: { roles: ['ROLE_RENTER'] } },
      { path: 'messages', component: ChatInboxComponent },
      { path: 'messages/:threadId', component: ChatThreadComponent },
      { path: 'notifications', component: NotificationListComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'favorites', component: FavoritesComponent, canActivate: [roleGuard], data: { roles: ['ROLE_RENTER'] } },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ROLE_ADMIN'] },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: AdminOverviewComponent },
      { path: 'listings', component: AdminListingsComponent },
      { path: 'listings/:listingId', component: AdminListingDetailComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'kyc', component: AdminKycComponent },
      { path: 'kyc/:submissionId', component: AdminKycDetailComponent },
      { path: 'notifications', component: NotificationListComponent },
      { path: 'audit', component: AdminAuditComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
