import { useState } from "react";
import axios from "axios";
import { DataTable } from "./DataTable";
import { Log, columns} from "./columns";
import { Progress } from "@/components/ui/progress"

function Tably() {
  const [file, setFile] = useState<any>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<number>(0);


  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    setLoading(50);
    const response = await axios.post('https://minav.pythonanywhere.com/upload', formData);
    setLoading(100);
    console.log(response.data);
    setLogs(response.data.logs);
  };

  



  return (
    <>
        <div className="mt-20">
            <div className="container mx-auto">
                <div className="flex justify-center flex-col gap-5 items-center">
                    <h1 className="text-2xl font-bold">ROS Log Viewer</h1>
                    <div>
                        <input type="file" onChange={e => {
                            if (e.target.files && e.target.files.length > 0) {
                                setFile(e.target.files[0]);
                            }
                        }} />
                        <button className=" bg-black text-white p-2 rounded-md" onClick={()=>{
                            handleFileUpload();
                        }}>Upload</button>
                       
                    </div>
                    <Progress value={loading} className="w-[60%]" />
                </div>


                <DataTable columns={columns} data={logs} />

            </div>
        </div>
    </>
  );
}

export default Tably;
