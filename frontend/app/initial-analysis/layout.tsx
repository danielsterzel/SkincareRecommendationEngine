import { SkinProfileProvider } from "../components/initial-analysis/SkinProfileContext";


export default function layout({children}: {children: React.ReactNode})
{
    return <SkinProfileProvider>{children}</SkinProfileProvider>
}