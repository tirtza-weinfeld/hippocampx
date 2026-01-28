import type React from "react"

export { SlopeIllustration } from "./slope"
export { FunctionIllustration } from "./function"
export { LimitIllustration } from "./limit"
export { DerivativeIllustration } from "./derivative"
export { IntegralIllustration } from "./integral"
export { RiseIllustration } from "./rise"
export { RunIllustration } from "./run"
export { CoordinateIllustration } from "./coordinate"
export { GraphIllustration } from "./graph"
export { DomainIllustration } from "./domain"
export { RangeIllustration } from "./range"
export { LinearFunctionIllustration } from "./linear-function"
export { QuadraticFunctionIllustration } from "./quadratic-function"
export { ContinuityIllustration } from "./continuity"
export { TangentLineIllustration } from "./tangent-line"
export { RateOfChangeIllustration } from "./rate-of-change"
export { PowerRuleIllustration } from "./power-rule"
export { ChainRuleIllustration } from "./chain-rule"
export { AntiderivativeIllustration } from "./antiderivative"
export { FundamentalTheoremIllustration } from "./fundamental-theorem"
export { OptimizationIllustration } from "./optimization"

import { SlopeIllustration } from "./slope"
import { FunctionIllustration } from "./function"
import { LimitIllustration } from "./limit"
import { DerivativeIllustration } from "./derivative"
import { IntegralIllustration } from "./integral"
import { RiseIllustration } from "./rise"
import { RunIllustration } from "./run"
import { CoordinateIllustration } from "./coordinate"
import { GraphIllustration } from "./graph"
import { DomainIllustration } from "./domain"
import { RangeIllustration } from "./range"
import { LinearFunctionIllustration } from "./linear-function"
import { QuadraticFunctionIllustration } from "./quadratic-function"
import { ContinuityIllustration } from "./continuity"
import { TangentLineIllustration } from "./tangent-line"
import { RateOfChangeIllustration } from "./rate-of-change"
import { PowerRuleIllustration } from "./power-rule"
import { ChainRuleIllustration } from "./chain-rule"
import { AntiderivativeIllustration } from "./antiderivative"
import { FundamentalTheoremIllustration } from "./fundamental-theorem"
import { OptimizationIllustration } from "./optimization"

export const termIllustrations: Record<string, React.ComponentType> = {
  Slope: SlopeIllustration,
  Rise: RiseIllustration,
  Run: RunIllustration,
  Function: FunctionIllustration,
  Coordinate: CoordinateIllustration,
  Graph: GraphIllustration,
  Domain: DomainIllustration,
  Range: RangeIllustration,
  "Linear Function": LinearFunctionIllustration,
  "Quadratic Function": QuadraticFunctionIllustration,
  Limit: LimitIllustration,
  Continuity: ContinuityIllustration,
  Derivative: DerivativeIllustration,
  "Tangent Line": TangentLineIllustration,
  "Rate of Change": RateOfChangeIllustration,
  "Power Rule": PowerRuleIllustration,
  "Chain Rule": ChainRuleIllustration,
  Integral: IntegralIllustration,
  Antiderivative: AntiderivativeIllustration,
  "Fundamental Theorem": FundamentalTheoremIllustration,
  Optimization: OptimizationIllustration,
}
