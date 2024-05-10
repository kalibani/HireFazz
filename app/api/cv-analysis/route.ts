import prismadb from "@/lib/prismadb";
import { ANALYSYS_STATUS } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// update cvanalysis status
export const PATCH = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const status = body.actionName
        const idList = body.selectedIds

        if (!status || !idList?.length) {
            return new NextResponse('Not Found', { status: 404 })
        }

        const supportedStatus = Object.values(ANALYSYS_STATUS)

        if (!supportedStatus.includes(status.toUpperCase())) {
            return new NextResponse('Wrong Action', { status: 400 })
        }

        const cvAnalysis = await prismadb.cvAnalysis.updateMany({
            where: {
                id: {
                    in: body.selectedIds
                }
            },
            data: {
                status,
            }
        });

        return NextResponse.json(cvAnalysis)


    } catch (error) {
        return NextResponse.json('Internal Server Error', { status: 500 });
    }
}

// batch delete cv analysis
export const DELETE = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const idList = body.selectedIds

        if (!idList?.length) {
            return new NextResponse('Please Provide Ids', { status: 400 })
        }

        const cvAnalysis = await prismadb.cvAnalysis.deleteMany({
            where: {
                id: {
                    in: idList
                }
            }
        });

        return NextResponse.json(cvAnalysis, { status: 200 })
    } catch (error) {
        console.log('error api', error);
        return NextResponse.json('Internal Server Error', { status: 500 });
    }
}
