import { BoardingPass } from "../domain/boardingPass";
import { ICRUD } from "../utils/interfaces/ICRUD";
import { ISearch } from "../utils/interfaces/ISearch";

export interface BoardingPassRepo extends ICRUD<BoardingPass>, ISearch<BoardingPass>{}