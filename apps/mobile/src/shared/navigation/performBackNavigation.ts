import { RESIDENT_ROUTE_FALLBACKS } from "../../modules/resident/navigation/residentRouteFallbacks";
import type { Absent } from "../types/absence.types";
import type { JsonObject, JsonValue } from "../../core/api/api.types";

export interface BackNavigationOptions {
  customHandler?: (() => void) | Absent;
  fallbackTab?: string | Absent;
  fallbackRoute?: string | Absent;
  currentRouteName?: string | Absent;
}
export type NavigationLike =
  | {
      canGoBack?: (() => boolean) | Absent;
      goBack?: (() => void) | Absent;
      getParent?: (() => NavigationLike | null | Absent) | Absent;
      navigate?: ((name: string, params?: object | Absent) => void) | Absent;
    }
  | null
  | Absent;

export function performBackNavigation(
  navigation: NavigationLike,
  options?: BackNavigationOptions | (() => void) | Absent,
): void {
  if (!navigation) return;
  const resolvedOptions: BackNavigationOptions =
    typeof options === "function"
      ? { customHandler: options }
      : (options ?? {});
  if (resolvedOptions.customHandler) {
    try {
      resolvedOptions.customHandler();
      return;
    } catch (e) {
      console.warn("Custom back handler error, falling back:", e);
    }
  }
  if (typeof navigation.canGoBack === "function" && navigation.canGoBack()) {
    navigation.goBack?.();
    return;
  }
  const parent =
    typeof navigation.getParent === "function" ? navigation.getParent() : null;
  if (parent && typeof parent.canGoBack === "function" && parent.canGoBack()) {
    parent.goBack?.();
    return;
  }
  const routeName = resolvedOptions.currentRouteName;
  const fallback = routeName ? RESIDENT_ROUTE_FALLBACKS[routeName] : undefined;
  const targetTab = resolvedOptions.fallbackTab ?? fallback?.tab ?? "HomeTab";
  const targetScreen =
    resolvedOptions.fallbackRoute ?? fallback?.screen ?? "ResidentHome";
  if (typeof navigation.navigate === "function") {
    try {
      navigation.navigate(targetTab, { screen: targetScreen });
      return;
    } catch {
      try {
        navigation.navigate("HomeTab", { screen: "ResidentHome" });
        return;
      } catch {}
    }
  }
}
export default performBackNavigation;
