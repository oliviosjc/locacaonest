import { UserDTO } from "../../users/dtos/user.dto";

export class GetMyCompaniesDTO
{
    id: string;
    socialName: string;
    fantasyName: string;
    document: string;
    owner: UserDTO;

    constructor(id: string, socialName: string, fantasyName: string, document: string, owner: UserDTO)
    {
        this.id = id;
        this.socialName = socialName;
        this.fantasyName = fantasyName;
        this.document = document;
        this.owner = owner;
    }
}