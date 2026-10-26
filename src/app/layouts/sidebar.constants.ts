export const SIDEBAR_REVEAL_CLASS_NAME =
  "transition-[opacity,transform] duration-250 ease-out delay-100 group-data-[collapsible=icon]:-translate-x-2 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:delay-0";

export const SIDEBAR_MENU_BUTTON_CLASS_NAME = [
  "h-10 gap-3 rounded-xl pr-3 pl-2 text-[0.9375rem] font-normal text-sidebar-foreground/80",
  "transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.97]",
  "hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
  "data-active:bg-background data-active:font-medium data-active:text-sidebar-foreground data-active:shadow-[0_1px_2px_rgb(0_0_0/0.06)] data-active:ring-1 data-active:ring-sidebar-border dark:data-active:bg-sidebar-accent",
  "[&_svg]:size-5 [&_svg]:text-sidebar-foreground/60 [&_svg]:transition-colors [&_svg]:duration-200 [&_svg]:ease-out hover:[&_svg]:text-sidebar-foreground data-active:[&_svg]:text-sidebar-foreground",
  "[&>span]:transition-[opacity,transform] [&>span]:duration-250 [&>span]:ease-out [&>span]:delay-[calc(var(--item-index,0)*45ms+90ms)]",
  "group-data-[collapsible=icon]:[&>span]:-translate-x-2 group-data-[collapsible=icon]:[&>span]:opacity-0 group-data-[collapsible=icon]:[&>span]:delay-0",
].join(" ");
