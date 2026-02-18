import React, { useState } from 'react';
import { Database, Play, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { supabase } from '../../lib/supabase';

const QUERIES = [
    {
        id: 'leads_check',
        label: 'Leads: id, lead_status, next_follow_up',
        description: 'SELECT id, lead_status, next_follow_up FROM leads ORDER BY updated_at DESC LIMIT 3',
        run: async () => {
            const { data, error } = await supabase
                ?.from('leads')
                ?.select('id, lead_status, next_follow_up')
                ?.order('updated_at', { ascending: false })
                ?.limit(3);
            if (error) throw error;
            return data;
        },
    },
    {
        id: 'appointments_check',
        label: 'Appointments: id, appointment_status, scheduled_at',
        description: 'SELECT id, appointment_status, scheduled_at FROM appointments ORDER BY scheduled_at DESC LIMIT 3',
        run: async () => {
            const { data, error } = await supabase
                ?.from('appointments')
                ?.select('id, appointment_status, scheduled_at')
                ?.order('scheduled_at', { ascending: false })
                ?.limit(3);
            if (error) throw error;
            return data;
        },
    },
    {
        id: 'explain_check',
        label: 'EXPLAIN ANALYZE: Scheduled appointments query',
        description: `EXPLAIN ANALYZE SELECT * FROM appointments WHERE appointment_status = 'scheduled' ORDER BY scheduled_at DESC LIMIT 10`,
        run: async () => {
            // Try using rpc for EXPLAIN ANALYZE, fallback to a simple query
            try {
                const { data, error } = await supabase?.rpc('explain_scheduled_appointments');
                if (error) {
                    // Fallback: just run the actual query and report timing
                    const start = performance.now();
                    const { data: fallbackData, error: fallbackError } = await supabase
                        ?.from('appointments')
                        ?.select('*')
                        ?.eq('appointment_status', 'scheduled')
                        ?.order('scheduled_at', { ascending: false })
                        ?.limit(10);
                    const elapsed = (performance.now() - start).toFixed(2);
                    if (fallbackError) throw fallbackError;
                    return {
                        note: 'EXPLAIN ANALYZE requires a server-side RPC function. Ran actual query instead.',
                        query_time_ms: elapsed,
                        rows_returned: fallbackData?.length || 0,
                        sample: fallbackData?.slice(0, 3)?.map(r => ({
                            id: r?.id,
                            appointment_status: r?.appointment_status,
                            scheduled_at: r?.scheduled_at,
                        })),
                    };
                }
                return data;
            } catch (err) {
                // Final fallback
                const start = performance.now();
                const { data: fallbackData, error: fallbackError } = await supabase
                    ?.from('appointments')
                    ?.select('id, appointment_status, scheduled_at')
                    ?.eq('appointment_status', 'scheduled')
                    ?.order('scheduled_at', { ascending: false })
                    ?.limit(10);
                const elapsed = (performance.now() - start).toFixed(2);
                if (fallbackError) throw fallbackError;
                return {
                    note: 'EXPLAIN ANALYZE not available via client. Ran actual query instead.',
                    query_time_ms: elapsed,
                    rows_returned: fallbackData?.length || 0,
                    sample: fallbackData?.slice(0, 3),
                };
            }
        },
    },
];

const SchemaSanityCheck = () => {
    const [results, setResults] = useState({});

    const runQuery = async (query) => {
        setResults(prev => ({ ...prev, [query.id]: { status: 'running' } }));
        try {
            const data = await query.run();
            setResults(prev => ({ ...prev, [query.id]: { status: 'success', data } }));
        } catch (err) {
            setResults(prev => ({
                ...prev,
                [query.id]: { status: 'error', error: err?.message || String(err) },
            }));
        }
    };

    const runAll = async () => {
        for (const q of QUERIES) {
            await runQuery(q);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
                <Sidebar onToggle={() => { }} />
                <main className="flex-1 ml-64 p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Database className="w-6 h-6 text-purple-600" />
                                Schema Sanity Check
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Dev-only page &mdash; verifies Supabase queries match the actual schema
                            </p>
                        </div>
                        <button
                            onClick={runAll}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <Play className="w-4 h-4" /> Run All Queries
                        </button>
                    </div>

                    <div className="space-y-6">
                        {QUERIES.map((query) => {
                            const result = results[query.id];
                            return (
                                <div key={query.id} className="bg-white rounded-lg border border-gray-200 p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{query.label}</h3>
                                            <pre className="text-xs text-gray-500 mt-1 bg-gray-50 p-2 rounded overflow-x-auto">
                                                {query.description}
                                            </pre>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {result?.status === 'running' && (
                                                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                                            )}
                                            {result?.status === 'success' && (
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            )}
                                            {result?.status === 'error' && (
                                                <XCircle className="w-4 h-4 text-red-500" />
                                            )}
                                            <button
                                                onClick={() => runQuery(query)}
                                                className="px-3 py-1 text-xs font-medium text-purple-600 border border-purple-300 rounded hover:bg-purple-50"
                                            >
                                                Run
                                            </button>
                                        </div>
                                    </div>

                                    {/* Results */}
                                    {result?.status === 'success' && (
                                        <div className="mt-3">
                                            {Array.isArray(result.data) ? (
                                                result.data.length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-xs">
                                                            <thead className="bg-green-50">
                                                                <tr>
                                                                    {Object.keys(result.data[0]).map((col) => (
                                                                        <th key={col} className="text-left px-3 py-2 font-medium text-gray-700">
                                                                            {col}
                                                                        </th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-100">
                                                                {result.data.map((row, i) => (
                                                                    <tr key={i}>
                                                                        {Object.values(row).map((val, j) => (
                                                                            <td key={j} className="px-3 py-2 text-gray-800">
                                                                                {val === null ? <span className="text-gray-400">null</span> : String(val)}
                                                                            </td>
                                                                        ))}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-500">Query returned 0 rows (table may be empty)</p>
                                                )
                                            ) : (
                                                <pre className="text-xs bg-green-50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                                                    {JSON.stringify(result.data, null, 2)}
                                                </pre>
                                            )}
                                        </div>
                                    )}
                                    {result?.status === 'error' && (
                                        <div className="mt-3 bg-red-50 p-3 rounded">
                                            <p className="text-xs text-red-700 font-medium">Error:</p>
                                            <p className="text-xs text-red-600 mt-1">{result.error}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-xs text-yellow-800">
                            <strong>Note:</strong> The EXPLAIN ANALYZE query requires a server-side RPC function
                            (<code>explain_scheduled_appointments</code>). If not available, the page falls back
                            to running the actual query and measuring client-side timing.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SchemaSanityCheck;
