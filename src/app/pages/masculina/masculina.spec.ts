import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Masculina } from './masculina';

describe('Masculina', () => {
  let component: Masculina;
  let fixture: ComponentFixture<Masculina>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Masculina]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Masculina);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
