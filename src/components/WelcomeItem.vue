<template>
  <div class="mt-8 flex relative md:mt-0 md:py-[0.4rem_0_1rem_calc(var(--section-gap)/2)] md:before:content-[' '] md:before:border-l md:before:border-[var(--color-border)] md:before:absolute md:before:left-0 md:before:bottom-[calc(50%+25px)] md:before:h-[calc(50%-25px)] md:after:content-[' '] md:after:border-l md:after:border-[var(--color-border)] md:after:absolute md:after:left-0 md:after:top-[calc(50%+25px)] md:after:h-[calc(50%-25px)] first:md:before:hidden last:md:after:hidden">
    <i class="flex items-center justify-center w-8 h-8 text-[var(--color-text)] md:absolute md:top-[calc(50%-25px)] md:left-[-26px] md:border md:border-[var(--color-border)] md:bg-[var(--color-background)] md:rounded-lg md:w-[50px] md:h-[50px]">
      <slot name="icon"></slot>
    </i>
    <div class="flex-1 ml-4">
      <h3 class="text-[1.2rem] font-medium mb-[0.4rem] text-[var(--color-heading)]">
        <slot name="heading"></slot>
      </h3>
      <slot></slot>
    </div>
  </div>
</template>
