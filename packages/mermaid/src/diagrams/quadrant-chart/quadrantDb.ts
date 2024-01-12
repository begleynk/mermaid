import { getConfig } from '../../diagram-api/diagramAPI.js';
import { sanitizeText } from '../common/common.js';
import {
  setAccTitle,
  getAccTitle,
  setDiagramTitle,
  getDiagramTitle,
  getAccDescription,
  setAccDescription,
  clear as commonClear,
} from '../common/commonDb.js';
import type { stylesObject } from './quadrantBuilder.js';
import { QuadrantBuilder } from './quadrantBuilder.js';

const config = getConfig();

function textSanitizer(text: string) {
  return sanitizeText(text.trim(), config);
}

type LexTextObj = { text: string; type: 'text' | 'markdown' };

const quadrantBuilder = new QuadrantBuilder();

function setQuadrant1Text(textObj: LexTextObj) {
  quadrantBuilder.setData({ quadrant1Text: textSanitizer(textObj.text) });
}

function setQuadrant2Text(textObj: LexTextObj) {
  quadrantBuilder.setData({ quadrant2Text: textSanitizer(textObj.text) });
}

function setQuadrant3Text(textObj: LexTextObj) {
  quadrantBuilder.setData({ quadrant3Text: textSanitizer(textObj.text) });
}

function setQuadrant4Text(textObj: LexTextObj) {
  quadrantBuilder.setData({ quadrant4Text: textSanitizer(textObj.text) });
}

function setXAxisLeftText(textObj: LexTextObj) {
  quadrantBuilder.setData({ xAxisLeftText: textSanitizer(textObj.text) });
}

function setXAxisRightText(textObj: LexTextObj) {
  quadrantBuilder.setData({ xAxisRightText: textSanitizer(textObj.text) });
}

function setYAxisTopText(textObj: LexTextObj) {
  quadrantBuilder.setData({ yAxisTopText: textSanitizer(textObj.text) });
}

function setYAxisBottomText(textObj: LexTextObj) {
  quadrantBuilder.setData({ yAxisBottomText: textSanitizer(textObj.text) });
}

function parseStyles(stylesString: string): stylesObject {
  const stylesObject: stylesObject = {};
  if (stylesString !== '') {
    const styles = stylesString.trim().split(/\s*,\s*/);
    for (const item of styles) {
      const style = item.split(/\s*:\s*/);
      if (style[0] == 'radius') {
        stylesObject.radius = parseInt(style[1]);
      } else if (style[0] == 'color') {
        stylesObject.color = style[1];
      } else if (style[0] == 'stroke-color') {
        stylesObject.strokeColor = style[1];
      } else if (style[0] == 'stroke-width') {
        stylesObject.strokeWidth = style[1];
      } else {
        // do we add error if an unknown style is added or do we ignore it ???
      }
    }
  }
  return stylesObject;
}

function addPoint(
  textObj: LexTextObj,
  className: string,
  x: number,
  y: number,
  stylesString: string
) {
  const stylesObject = parseStyles(stylesString);
  quadrantBuilder.addPoints([
    {
      x,
      y,
      className: className,
      text: textSanitizer(textObj.text),
      radius: stylesObject.radius,
      color: stylesObject.color,
      strokeColor: stylesObject.strokeColor,
      strokeWidth: stylesObject.strokeWidth,
    },
  ]);
}

function addClass(stylesString: string) {
  const ind = stylesString.indexOf(' ');
  const className = stylesString.slice(0, ind);
  const styles = parseStyles(stylesString.slice(ind + 1));
  if (className === undefined || className === '') {
    // throw error
  }
  if (Object.keys(styles).length === 0) {
    // no styles added, throw error ???
  }
  quadrantBuilder.addClass(className, styles);
}

function setWidth(width: number) {
  quadrantBuilder.setConfig({ chartWidth: width });
}

function setHeight(height: number) {
  quadrantBuilder.setConfig({ chartHeight: height });
}

function getQuadrantData() {
  const config = getConfig();
  const { themeVariables, quadrantChart: quadrantChartConfig } = config;
  if (quadrantChartConfig) {
    quadrantBuilder.setConfig(quadrantChartConfig);
  }
  quadrantBuilder.setThemeConfig({
    quadrant1Fill: themeVariables.quadrant1Fill,
    quadrant2Fill: themeVariables.quadrant2Fill,
    quadrant3Fill: themeVariables.quadrant3Fill,
    quadrant4Fill: themeVariables.quadrant4Fill,
    quadrant1TextFill: themeVariables.quadrant1TextFill,
    quadrant2TextFill: themeVariables.quadrant2TextFill,
    quadrant3TextFill: themeVariables.quadrant3TextFill,
    quadrant4TextFill: themeVariables.quadrant4TextFill,
    quadrantPointFill: themeVariables.quadrantPointFill,
    quadrantPointTextFill: themeVariables.quadrantPointTextFill,
    quadrantXAxisTextFill: themeVariables.quadrantXAxisTextFill,
    quadrantYAxisTextFill: themeVariables.quadrantYAxisTextFill,
    quadrantExternalBorderStrokeFill: themeVariables.quadrantExternalBorderStrokeFill,
    quadrantInternalBorderStrokeFill: themeVariables.quadrantInternalBorderStrokeFill,
    quadrantTitleFill: themeVariables.quadrantTitleFill,
  });
  quadrantBuilder.setData({ titleText: getDiagramTitle() });
  return quadrantBuilder.build();
}

const clear = function () {
  quadrantBuilder.clear();
  commonClear();
};

export default {
  setWidth,
  setHeight,
  setQuadrant1Text,
  setQuadrant2Text,
  setQuadrant3Text,
  setQuadrant4Text,
  setXAxisLeftText,
  setXAxisRightText,
  setYAxisTopText,
  setYAxisBottomText,
  addPoint,
  addClass,
  getQuadrantData,
  clear,
  setAccTitle,
  getAccTitle,
  setDiagramTitle,
  getDiagramTitle,
  getAccDescription,
  setAccDescription,
};
