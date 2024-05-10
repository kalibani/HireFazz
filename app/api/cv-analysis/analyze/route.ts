import { bulkAnalyzeCv } from "@/lib/actions/cv/analyzeCv";
import { NextRequest, NextResponse } from "next/server";

// batch cv analyze
export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const idList = body.selectedIds
        const jobId = body.jobId

        if (!idList?.length) {
            return new NextResponse('Please provide ids', { status: 400 })
        }

        const analyzed = await bulkAnalyzeCv({ cvAnalysisIds: idList, jobId })

        return NextResponse.json('cvAnalysis', { status: 200 })
    } catch (error) {
        console.log('error api', error);
        return NextResponse.json('Internal Server Error', { status: 500 });
    }
}
