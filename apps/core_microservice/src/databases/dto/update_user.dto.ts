import { ApiPropertyOptional } from "@nestjs/swagger"

export class updateUserDto {
  @ApiPropertyOptional({ description: "User role", enum: ["user", "admin"] })
  role?: "user" | "admin"

  @ApiPropertyOptional({ description: "Account lock flag", type: Boolean })
  disabled?: boolean

  @ApiPropertyOptional({ description: "Identifier of the user performing the update" })
  updated_by?: string
}