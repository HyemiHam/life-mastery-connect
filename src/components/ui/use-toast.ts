// 이 파일은 hooks/use-toast를 컴포넌트에서 쉽게 사용할 수 있도록 내보내는 역할을 합니다
import { useToast as useToastHook, toast as toastFunction } from "@/hooks/use-toast";
export type { ToastActionElement, ToastProps } from "@/hooks/use-toast";

export const useToast = useToastHook;
export const toast = toastFunction; 