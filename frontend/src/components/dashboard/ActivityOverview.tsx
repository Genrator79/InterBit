import InterviewOverview from "./InterviewOverview"
import NextInterview from "./NextInterview";

function ActivityOverview() {
    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <InterviewOverview />
            <NextInterview />
        </div>
    );
}

export default ActivityOverview;
