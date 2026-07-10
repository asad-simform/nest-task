import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { Status } from 'src/database/entities/follower.entity';

export class ChangeStatusDTO {
    @ApiProperty({
        example: 9,
    })
    @IsNumber()
    followerId!: number;

    @ApiProperty({
        example: 'ACCEPTED',
    })
    @IsEnum(Status)
    status!: Status;
}
