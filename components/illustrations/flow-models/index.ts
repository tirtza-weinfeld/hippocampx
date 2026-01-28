import type { ComponentType } from "react"

export { ODEIllustration } from "./ode"
export { VectorFieldIllustration } from "./vector-field"
export { TrajectoryIllustration } from "./trajectory"
export { FlowIllustration } from "./flow"
export { EulerMethodIllustration } from "./euler-method"
export { HeunMethodIllustration } from "./heun-method"
export { FlowModelIllustration } from "./flow-model"
export { BrownianMotionIllustration } from "./brownian-motion"
export { OrnsteinUhlenbeckIllustration } from "./ornstein-uhlenbeck"
export { SDEIllustration } from "./sde"
export { DiffusionModelIllustration } from "./diffusion-model"
export { ProbabilityPathIllustration } from "./probability-path"
export { EulerMaruyamaIllustration } from "./euler-maruyama"
export { ScoreFunctionIllustration } from "./score-function"
export { GaussianPathIllustration } from "./gaussian-path"
export { FlowMatchingLossIllustration } from "./flow-matching-loss"
export { ClassifierFreeGuidanceIllustration } from "./classifier-free-guidance"
export { ConditionalMarginalIllustration } from "./conditional-marginal"
export { SDESamplingScoresIllustration } from "./sde-sampling-scores"

import { ODEIllustration } from "./ode"
import { VectorFieldIllustration } from "./vector-field"
import { TrajectoryIllustration } from "./trajectory"
import { FlowIllustration } from "./flow"
import { EulerMethodIllustration } from "./euler-method"
import { HeunMethodIllustration } from "./heun-method"
import { FlowModelIllustration } from "./flow-model"
import { BrownianMotionIllustration } from "./brownian-motion"
import { OrnsteinUhlenbeckIllustration } from "./ornstein-uhlenbeck"
import { SDEIllustration } from "./sde"
import { DiffusionModelIllustration } from "./diffusion-model"
import { ProbabilityPathIllustration } from "./probability-path"
import { EulerMaruyamaIllustration } from "./euler-maruyama"
import { ScoreFunctionIllustration } from "./score-function"
import { GaussianPathIllustration } from "./gaussian-path"
import { FlowMatchingLossIllustration } from "./flow-matching-loss"
import { ClassifierFreeGuidanceIllustration } from "./classifier-free-guidance"
import { ConditionalMarginalIllustration } from "./conditional-marginal"
import { SDESamplingScoresIllustration } from "./sde-sampling-scores"

export const flowModelIllustrations: Record<string, ComponentType> = {
  "ode": ODEIllustration,
  "vector-field": VectorFieldIllustration,
  "trajectory": TrajectoryIllustration,
  "flow": FlowIllustration,
  "euler-method": EulerMethodIllustration,
  "heun-method": HeunMethodIllustration,
  "flow-model": FlowModelIllustration,
  "brownian-motion": BrownianMotionIllustration,
  "ornstein-uhlenbeck": OrnsteinUhlenbeckIllustration,
  "sde": SDEIllustration,
  "diffusion-model": DiffusionModelIllustration,
  "probability-path": ProbabilityPathIllustration,
  "euler-maruyama": EulerMaruyamaIllustration,
  "score-function": ScoreFunctionIllustration,
  "gaussian-path": GaussianPathIllustration,
  "flow-matching-loss": FlowMatchingLossIllustration,
  "classifier-free-guidance": ClassifierFreeGuidanceIllustration,
  "conditional-marginal": ConditionalMarginalIllustration,
  "sde-sampling-scores": SDESamplingScoresIllustration,
}
