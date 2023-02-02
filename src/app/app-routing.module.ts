import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookComponent } from './pages/book/book.component';
import { DealsComponent } from './pages/deals/deals.component';
import { SearchComponent } from './pages/search/search.component';

const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch:'full'}, 
  { path: 'search', component: SearchComponent },
  { path: 'book', component: BookComponent },
  { path: 'deals', component: DealsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
