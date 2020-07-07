// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default async (req, res, next): Promise<void> => {
    if (!req.user.isAdmin) {
        res.status(403).send(new Error('Unauthorized'));
    }
    next();
};