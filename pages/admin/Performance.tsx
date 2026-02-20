
import React from 'react';
import { Activity, Server, Database, HardDrive, Cpu, Cloud, RefreshCw, CheckCircle } from 'lucide-react';

const StatusCard = ({ title, value, subValue, status, icon: Icon }: any) => (
    <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${status === 'good' ? 'bg-green-500/20 text-green-500' : status === 'warning' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>
                <Icon size={24} />
            </div>
        </div>
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'good' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            <p className="text-sm text-gray-400">{subValue}</p>
        </div>
    </div>
);

const ServiceRow = ({ name, uptime, latency, status }: any) => (
    <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl border border-dark-600">
        <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${status === 'operational' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-bold text-white">{name}</span>
        </div>
        <div className="flex items-center gap-8">
            <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-bold">Uptime</p>
                <p className="text-sm font-mono text-gray-300">{uptime}</p>
            </div>
            <div className="text-right w-20">
                <p className="text-xs text-gray-500 uppercase font-bold">Latency</p>
                <p className={`text-sm font-mono font-bold ${latency < 100 ? 'text-green-400' : 'text-yellow-400'}`}>{latency}ms</p>
            </div>
        </div>
    </div>
);

export default function AdminPerformance() {
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Activity className="text-brand-500" /> System Health
                    </h1>
                    <p className="text-gray-400 mt-1">Real-time infrastructure monitoring</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-white hover:bg-dark-700 transition-colors">
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatusCard 
                    title="CPU Usage" 
                    value="42%" 
                    subValue="12 Cores Active" 
                    status="good" 
                    icon={Cpu} 
                />
                <StatusCard 
                    title="Memory" 
                    value="12.4 GB" 
                    subValue="64GB Total" 
                    status="good" 
                    icon={Server} 
                />
                <StatusCard 
                    title="Database" 
                    value="890 QPS" 
                    subValue="No slow queries" 
                    status="good" 
                    icon={Database} 
                />
                <StatusCard 
                    title="Storage" 
                    value="85%" 
                    subValue="1.2TB / 1.5TB" 
                    status="warning" 
                    icon={HardDrive} 
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6">Node Status</h3>
                        <div className="space-y-4">
                            <ServiceRow name="API Gateway (US-East)" uptime="99.99%" latency={45} status="operational" />
                            <ServiceRow name="API Gateway (EU-West)" uptime="99.95%" latency={82} status="operational" />
                            <ServiceRow name="Auth Service" uptime="100%" latency={24} status="operational" />
                            <ServiceRow name="Media Processing" uptime="99.90%" latency={120} status="operational" />
                            <ServiceRow name="Realtime Socket Cluster" uptime="99.98%" latency={15} status="operational" />
                            <ServiceRow name="Payment Processor" uptime="99.99%" latency={210} status="operational" />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Incidents</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-600">
                                <div className="flex items-center gap-2 text-green-400 mb-1">
                                    <CheckCircle size={16} />
                                    <span className="text-xs font-bold uppercase">Resolved</span>
                                </div>
                                <p className="text-sm font-bold text-white">High latency in EU region</p>
                                <p className="text-xs text-gray-500 mt-1">2 hours ago • Duration: 15m</p>
                            </div>
                            <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-600">
                                <div className="flex items-center gap-2 text-green-400 mb-1">
                                    <CheckCircle size={16} />
                                    <span className="text-xs font-bold uppercase">Resolved</span>
                                </div>
                                <p className="text-sm font-bold text-white">Database backup delay</p>
                                <p className="text-xs text-gray-500 mt-1">Yesterday • Duration: 45m</p>
                            </div>
                        </div>
                        <button className="w-full mt-4 text-xs font-bold text-gray-400 hover:text-white transition-colors">View Incident History</button>
                    </div>

                    <div className="bg-gradient-to-br from-brand-900/50 to-dark-800 border border-brand-500/30 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Cloud className="text-brand-400" size={24} />
                            <h3 className="font-bold text-white">Cloud Costs</h3>
                        </div>
                        <p className="text-3xl font-black text-white mb-1">$2,450.00</p>
                        <p className="text-xs text-brand-200">Current month-to-date</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
