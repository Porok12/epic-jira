import {useState} from "react";
import {IconButton, Typography} from "@mui/material";
import {Refresh as RefreshIcon} from '@mui/icons-material';
import type {LoaderFunctionArgs, MetaFunction} from "@remix-run/node";
// import {useLoaderData} from "@remix-run/react";
// import JiraApi from 'jira-client';
//
// const jira = new JiraApi({
//     protocol: 'https',
//     host: 'jira.somehost.com',
//     username: 'username',
//     password: 'password',
//     apiVersion: '2',
//     strictSSL: true
// });

// export const loader = async ({}: LoaderFunctionArgs) => {
//     const jira = new JiraApi({
//         protocol: 'https',
//         host: 'jira.somehost.com',
//         username: 'username',
//         password: 'password',
//         apiVersion: '2',
//         strictSSL: true
//     });
//
//     const epicId = '';
//
//     return await jira.getIssuesForEpic(epicId);
// };

export const meta: MetaFunction = () => {
    return [
        {title: "EpicJira"},
        {name: "description", content: "Welcome to EpicJira!"},
    ];
};

export default function Index() {
    // const issues = useLoaderData<typeof loader>();
    const [issues, setIssues] = useState<any>(null);

    const getIssues = async () => {
        try {
            const epicId = '';
            const data = [{}];//await jira.getIssuesForEpic(epicId);

            console.log('API Call Result:', data);
            setIssues(data);
        } catch (error) {
            // Handle the error
            console.error('API call error:', error);
        }
    };

    return (
        <div style={{fontFamily: "system-ui, sans-serif", lineHeight: "1.8"}}>
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome to EpicJira
            </Typography>

            <IconButton onClick={getIssues}>
                <RefreshIcon/>
            </IconButton>

            <Typography variant="body1">
                {JSON.stringify(issues, null, 2)}
            </Typography>
        </div>
    );
}
