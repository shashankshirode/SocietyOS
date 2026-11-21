import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Motion } from "../theme/motion";
import { SlideUpView } from "./SlideUpView";
import { createViewGapStyle } from "./styles/StaggeredList.styles";
type StaggeredListProps<T> = {
    data: T[];
    keyExtractor: (item: T, index: number) => string;
    renderItem: (item: T, index: number) => React.ReactNode;
    gap?: number;
    style?: StyleProp<ViewStyle>;
};
export function StaggeredList<T>({ data, keyExtractor, renderItem, gap = 12, style }: StaggeredListProps<T>) {
    return (<View style={[createViewGapStyle(gap), style]}>
      {data.map((item, index) => (<SlideUpView key={keyExtractor(item, index)} delay={index * Motion.stagger.normal}>
          {renderItem(item, index)}
        </SlideUpView>))}
    </View>);
}

