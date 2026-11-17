import type { ComponentType } from "react";
import BargainArt from "./bargain";
import CandidArt from "./candid";
import DisparateArt from "./disparate";
import EphemeralArt from "./ephemeral";
import EquivalentArt from "./equivalent";
import MeticulousArt from "./meticulous";
import MortgageArt from "./mortgage";
import PonderArt from "./ponder";
import ResilientArt from "./resilient";
import ScrutinyArt from "./scrutiny";

/** 每个词的插画，以及压在上面的竖排单词该用浅字还是深字 */
export const ART: Record<string, { Art: ComponentType; tone: "light" | "dark" }> = {
  ephemeral: { Art: EphemeralArt, tone: "light" },
  mortgage: { Art: MortgageArt, tone: "light" },
  resilient: { Art: ResilientArt, tone: "dark" },
  meticulous: { Art: MeticulousArt, tone: "dark" },
  bargain: { Art: BargainArt, tone: "light" },
  candid: { Art: CandidArt, tone: "light" },
  ponder: { Art: PonderArt, tone: "light" },
  scrutiny: { Art: ScrutinyArt, tone: "light" },
  disparate: { Art: DisparateArt, tone: "light" },
  equivalent: { Art: EquivalentArt, tone: "dark" },
};
