import { useEffect, useState } from "react";
import DataService from "@/services/dataService";
import { MainMetricsType,
    Disease,
    Treatment,
    PhasePercentage,
    TopCenter,
    TypesPerCenter,
    Representatividade,
 } from "@/types/dataTypes";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
  } from '@/components/ui/accordion';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BD4', '#FF6666', '#66FF66', '#FFCC66', '#66CCFF', '#CC66FF'];
const PHASE_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const MainDiseasesChart = ({ data }: { data: Disease[] }) => (
    <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="disease" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="rgb(44, 110, 242)" name="Contagem" />
    </BarChart>
    </ResponsiveContainer>
    );

    const MainTreatmentsPieChart = ({ data }: { data: Treatment[] }) => {
        const normalizedData = data.reduce((acc: Treatment[], treatment: Treatment) => {
            const normalizedName = treatment.treatment.toLowerCase();
            const existingTreatment = acc.find(item => 
                item.treatment.toLowerCase() === normalizedName
            );
    
            if (existingTreatment) {
                existingTreatment.count += treatment.count;
            } else {
                acc.push({
                    treatment: normalizedName,
                    count: treatment.count
                });
            }
    
            return acc;
        }, []);
    
        const sortedData = normalizedData.sort((a, b) => b.count - a.count);
    
        return (
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={sortedData}
                        dataKey="count"
                        nameKey="treatment"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                    >
                        {sortedData.map((_, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
            </ResponsiveContainer>
        );
    };

const PhasePercentagesChart = ({ data }: {data: PhasePercentage[]}) => {
    const getPhaseLabel = (phase: string) => {
        const phaseMap: Record<string, string> = {
            'NA': 'Não Informado',
            'PHASE1': 'Fase 1',
            'PHASE2': 'Fase 2',
            'PHASE3': 'Fase 3',
            'PHASE4': 'Fase 4',
            'EARLY_PHASE1': 'Fase Inicial'
        };
        return phaseMap[phase] || phase;
    };

    const formattedData = data.map(item => ({
        ...item,
        phase: getPhaseLabel(item.phase)
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={formattedData}
                    dataKey="percentage"
                    nameKey="phase"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#82ca9d"
                    label={({ phase, percentage }) => `${phase}: ${percentage.toFixed(1)}%`}
                >
                    {formattedData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PHASE_COLORS[index % PHASE_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
        </ResponsiveContainer>
    );
};

const RepresentatividadeCards = ({ data }: {data: Representatividade}) => (
    <div className="flex flex-col md:flex-row gap-4">
    <Card className="flex-1 flex items-center p-4 bg-blue-100 rounded-lg shadow-md">
        <div>
        <h3 className="text-lg font-semibold">Representatividade</h3>
        <p className="text-xl">{data.representatividade.toFixed(2)}%</p>
        </div>
    </Card>
    <Card className="flex-1 flex items-center p-4 bg-green-100 rounded-lg shadow-md">
        <div>
        <h3 className="text-lg font-semibold">Total no Brasil</h3>
        <p className="text-xl">{data.total_brazil_studies.toLocaleString()}</p>
        </div>
    </Card>
    <Card className="flex-1 flex items-center p-4 bg-yellow-100 rounded-lg shadow-md">
        <div>
        <h3 className="text-lg font-semibold">Total Global</h3>
        <p className="text-xl">{data.total_global_studies.toLocaleString()}</p>
        </div>
    </Card>
    </div>
    );

const TopCentersTable = ({ data }: {data: TopCenter[]}) => {
    return (
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
            <tr>
            <th className="py-2 px-4 text-left">Centro</th>
            <th className="py-2 px-4 text-left">Contagem</th>
            </tr>
        </thead>
        <tbody>
            {data.map((center, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="py-2 px-4">{center.facility}</td>
                <td className="py-2 px-4">{center.count}</td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    );
    };

const StudyTypesAccordions = ({ data }: { data: TypesPerCenter }) => {
    const getStudyTypeLabel = (studyType: string) => {
        const typeMap: Record<string, string> = {
            'INTERVENTIONAL': 'Intervencional',
            'OBSERVATIONAL': 'Observacional',
            'EXPANDED_ACCESS': 'Acesso Expandido'
        };
        return typeMap[studyType] || studyType;
    };

    return (
        <Accordion type="multiple">
            {Object.entries(data).map(([center, types], index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>
                        <h4 className="font-medium">{center}</h4>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="w-full h-64">
                            <ResponsiveContainer>
                                <BarChart
                                    data={Array.isArray(types) ? types.map(type => ({
                                        ...type,
                                        study_type: getStudyTypeLabel(type.study_type)
                                    })) : []}
                                    layout="vertical"
                                    margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="study_type" type="category" width={150} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="rgb(44, 110, 242)" name="Contagem" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
    };

export default function DashboardDados() {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<MainMetricsType | null>(null);

    useEffect(() => {
    fetchData();
    }, []);

    const fetchData = async () => {
    setLoading(true);
    try {
        const response = await DataService.fetchMetrics();
        setData(response);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
    }

    return (
    <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Dashboard de Dados</h1>
        {isLoading && <p className="text-center">Carregando...</p>}
        {data && (
        <div className="grid grid-cols-1 gap-6">
            <Card>
            <CardHeader>
                <CardTitle>Representatividade</CardTitle>
            </CardHeader>
            <CardContent>
                <RepresentatividadeCards data={data.representatividade} />
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>Principais Doenças</CardTitle>
            </CardHeader>
            <CardContent>
                <MainDiseasesChart data={data.main_diseases} />
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>Tratamentos Principais</CardTitle>
            </CardHeader>
            <CardContent>
                <MainTreatmentsPieChart data={data.main_treatments} />
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>Distribuição por Fase</CardTitle>
            </CardHeader>
            <CardContent>
                <PhasePercentagesChart data={data.phase_percentages} />
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>Principais Centros</CardTitle>
            </CardHeader>
            <CardContent>
                <TopCentersTable data={data.top_centers} />
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>Tipos de Estudos por Centro</CardTitle>
            </CardHeader>
            <CardContent>
                <StudyTypesAccordions data={data.types_per_centers} />
            </CardContent>
            </Card>
        </div>
        )}
    </div>
    );
    }
