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

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'search', component: SearchComponent },
      { path: 'search/:id', component: SearchListingDetailComponent },
      { path: 'listings', component: MyListingsComponent, canActivate: [authGuard] },
      { path: 'listings/create', component: CreateListingComponent, canActivate: [authGuard] },
      { path: 'listings/:id', component: ListingDetailComponent, canActivate: [authGuard] },
      { path: 'verification', component: KycComponent, canActivate: [authGuard] },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
      { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
      { path: 'favorites', component: FavoritesComponent, canActivate: [authGuard] },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: DashboardOverviewComponent },
      { path: 'listings', component: MyListingsComponent },
      { path: 'listings/create', component: CreateListingComponent },
      { path: 'listings/:id', component: ListingDetailComponent },
      { path: 'bookings', component: RenterBookingsComponent },
      { path: 'bookings/:id', component: BookingDetailComponent },
      { path: 'requests', component: LandlordBookingsComponent },
      { path: 'payments', component: PaymentHistoryComponent },
      { path: 'payments/:bookingId/checkout', component: PaymentCheckoutComponent },
      { path: 'messages', component: ChatInboxComponent },
      { path: 'messages/:threadId', component: ChatThreadComponent },
      { path: 'notifications', component: NotificationListComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'favorites', component: FavoritesComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
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
