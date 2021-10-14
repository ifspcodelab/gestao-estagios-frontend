import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, first } from 'rxjs/operators';
import { User } from 'src/app/core/models/user.model';
import { JwtTokenService } from 'src/app/core/services/jwt-token.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-account-show',
  templateUrl: './account-show.component.html',
  styleUrls: ['./account-show.component.scss']
})
export class AccountShowComponent implements OnInit {
  loading: boolean = true;
  user: User;
  registration: string | null;

  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private jwtTokenService: JwtTokenService,
  ) { }

  ngOnInit(): void {
    this.registration = this.route.snapshot.paramMap.get('registration');
    this.loaderService.show();

    this.jwtTokenService.setToken(this.localStorageService.get('access_token')!);
    const registration = this.jwtTokenService.getSubject();


    this.userService.getUserByRegistration(registration!)
      .pipe(
        first(),
        finalize(() => {
          this.loaderService.hide();
          this.loading = false;
        })
      )
      .subscribe(
        user => {
          this.user = user;
        }
      )
  }

  userDetails() {
    const getUserData = () => {
      const user: User = this.user;
      return `${user.email}`
    }
    return {
      itens: [
        { icon: 'alternate_email', title: 'E-mail', lines: [getUserData()] }
      ]
    };
  }

}
