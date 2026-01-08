import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Feminina } from './feminina';

describe('Feminina', () => {
  let component: Feminina;
  let fixture: ComponentFixture<Feminina>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Feminina]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Feminina);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
