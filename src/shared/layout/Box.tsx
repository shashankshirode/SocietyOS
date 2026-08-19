import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { Spacing, SpacingToken } from '../theme/spacing';
import type { Absent } from "../types/absence.types";
export interface BoxProps {
    children?: React.ReactNode;
    p?: SpacingToken | number;
    px?: SpacingToken | number;
    py?: SpacingToken | number;
    pt?: SpacingToken | number;
    pb?: SpacingToken | number;
    pl?: SpacingToken | number;
    pr?: SpacingToken | number;
    m?: SpacingToken | number;
    mx?: SpacingToken | number;
    my?: SpacingToken | number;
    mt?: SpacingToken | number;
    mb?: SpacingToken | number;
    ml?: SpacingToken | number;
    mr?: SpacingToken | number;
    flex?: number;
    flexShrink?: number;
    flexGrow?: number;
    width?: ViewStyle['width'];
    height?: ViewStyle['height'];
    backgroundColor?: string;
    alignItems?: ViewStyle['alignItems'];
    justifyContent?: ViewStyle['justifyContent'];
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
    testID?: string;
}
const getSpacingValue = (tokenOrValue?: SpacingToken | number): number | Absent => {
    if (tokenOrValue === undefined)
        return undefined;
    if (typeof tokenOrValue === 'number')
        return tokenOrValue;
    return Spacing[tokenOrValue];
};
export function Box({ children, p, px, py, pt, pb, pl, pr, m, mx, my, mt, mb, ml, mr, flex, flexShrink, flexGrow, width, height, backgroundColor, alignItems, justifyContent, borderRadius, style, testID, }: BoxProps) {
    const boxStyle: ViewStyle = {
        padding: getSpacingValue(p),
        paddingHorizontal: getSpacingValue(px),
        paddingVertical: getSpacingValue(py),
        paddingTop: getSpacingValue(pt),
        paddingBottom: getSpacingValue(pb),
        paddingLeft: getSpacingValue(pl),
        paddingRight: getSpacingValue(pr),
        margin: getSpacingValue(m),
        marginHorizontal: getSpacingValue(mx),
        marginVertical: getSpacingValue(my),
        marginTop: getSpacingValue(mt),
        marginBottom: getSpacingValue(mb),
        marginLeft: getSpacingValue(ml),
        marginRight: getSpacingValue(mr),
        flex,
        flexShrink,
        flexGrow,
        width,
        height,
        backgroundColor,
        alignItems,
        justifyContent,
        borderRadius,
    };
    return (<View testID={testID} style={[boxStyle, style]}>
      {children}
    </View>);
}
export default Box;

