import bcrypt from 'bcryptjs'

export const hashPassword = (password: string) => bcrypt.hashSync(password, 10)
export const comparePassword = async (password: string, hashed: string) => await bcrypt.compare(password, hashed)