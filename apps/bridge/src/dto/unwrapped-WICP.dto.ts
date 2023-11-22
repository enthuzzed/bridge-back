import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class UnwrappedWICPDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly uAddress: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly amount: number;
}