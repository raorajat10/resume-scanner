import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import {  Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";



export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resume-init" },
    { name: "description", content: "Feedback on Resume init!" },
  ];
}

export default function Home() {
  const { auth,kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes,setResumes]=useState<Resume[]>([]);
  const [loadingResumes,setLoadingResumes]=useState(false);


  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(()=>{
    const loadResumes= async ()=>{
      setLoadingResumes(true);


      const resumes = (await kv.list("*",true)) as KVItem[];


      const parsedResumes = resumes?.map((resume)=>(
JSON.parse(resume.value) as Resume
      ))
     console.log("parsedResumes", parsedResumes);
     
      setResumes(parsedResumes || [])
      setLoadingResumes(false);
    }
    loadResumes();
  },[]);



 
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track your Application & Resume Ratings</h1>
           {!loadingResumes && resumes?.length === 0 ? (
          <div className="resume-section">
           <h2>No resumes Found.   upload your first resume</h2>
          </div>
        ):(
          <h2>Review Your Submission and Check Ai Powered Feedback </h2>
        )}
        </div>

    {loadingResumes && (
      <div className="flex flex-col items-center justify-center">
        <img src="/images/resume-scan-2.gif" className="w-[200px]" />
      </div>
    )}


        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard  key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes.length===0 &&(
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link className="primary-button w-fit text-xl font-semibold" to="/upload">Upload Resume</Link>
          </div>
        )}
      </section>
    </main>
  );
}
