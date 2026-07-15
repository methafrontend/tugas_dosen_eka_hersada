import { NgClass } from '@angular/common';
import { Component, computed, EventEmitter, Input, input, OnInit, Output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-button',
  template: `
      <button
        pButton
        [type]="type"
        [disabled]="isDisabled()"
        [ngClass]="[class, variantClass, sizeClass]"
        class="rounded-xl! flex items-center text-sm! px-6!"
        (click)="handleClick()"
      >
        @if (loadings() && loading) {
          <i class="pi pi-spinner animate-spin text-white"></i>
        }
        <ng-content>
          Label
        </ng-content>
      </button>
  `,
  imports: [ButtonModule, NgClass],
})
export class ButtonComponent implements OnInit {

  disabled: any = input(false);
  internalDisabled = signal(false);
  isDisabled = computed(() => this.internalDisabled() || this.disabled());
  @Input() variant: 'primary' | 'outline-primary' | 'success' | 'warning' | 'secondary' | 'danger' | 'outline' | 'softblue' | 'gray' | 'white' | 'ghost' | 'aurora' | 'midnight' | 'violet' = 'primary';
  @Input() size: 'sm' | 'lg' | 'xl' = 'sm';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() class = '';
  @Input() loading = false;

  @Input() debounceTime = 2000; // waktu tunggu (2 detik)
  private debounceTimer: any = null;

  loadings = signal(false);

  @Output() onClick = new EventEmitter<void>();

  constructor() { }

  ngOnInit() { }

  handleClick() {
    // logika anti spam klik berulang
    if (!this.debounceTimer) {
      this.onClick.emit();
    }

    this.loadings.set(true);

    clearTimeout(this.debounceTimer);
    // set timer baru
    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = null;
      this.loadings.set(false);
    }, this.debounceTime);
  }

  get variantClass() {
    switch (this.variant) {
      case 'primary':
        return 'bg-[#206EE1]! border-[#206EE1]! text-white hover:bg-[#206EE1]/90!';
      case 'success':
        return 'bg-[#15A244]! border-[#15A244]! text-white hover:bg-[#13b248]!';
      case 'warning':
        return 'bg-[#CC8E12]! border-[#CC8E12]! text-white hover:bg-[#e09d17]!';
      case 'secondary':
        return 'bg-[#EFF2F5]! border-[#EFF2F5]! text-[#050505]! hover:bg-[#E5E5E5]!';
      case 'danger':
        return 'bg-[#D12D39]! border-[#D12D39]! text-white hover:bg-[#fd313f]!';
      case 'outline':
        return 'bg-[#FFFFFF]! border-[#EFF2F5]! text-[#050505]! hover:bg-[#F8F9FA]!';
      case 'ghost':
        return 'bg-transparent! border-none! text-[#585858]!';
      case 'softblue':
        return 'text-primary! bg-[#e5f0fb]! border-[#e5f0fb]! hover:bg-[#d5e7f8]!';
      case 'gray':
        return 'bg-[#EFF2F5]! border-[#EFF2F5]! hover:bg-[#E5E5E5]! text-[#6A6C6D]!';
      case 'outline-primary':
        return 'bg-transparent! border-primary! text-primary!';
      case 'white':
        return 'bg-[#FFFFFF70]! border-none! text-black! hover:bg-[#FFFFFF95]!';
      case 'aurora':
        return 'bg-linear-to-r! from-sky! via-lavender! to-blush! border-none! text-white hover:opacity-90';
      case 'midnight':
        return 'bg-midnight! border-midnight! text-white hover:bg-midnight/80!';
      case 'violet':
        return 'bg-violet! border-violet! text-white hover:bg-violet/90!';
      default:
        return 'bg-primary! border-primary! text-white hover:bg-primary/90!';
    }
  }

  get sizeClass() {
    switch (this.size) {
      case 'lg':
        return 'h-14!';
      case 'xl':
        return 'h-16!';
      default:
        return 'h-12!';
    }
  }

}
