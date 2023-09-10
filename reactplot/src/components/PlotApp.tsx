import { useState } from 'react';
import Dropzone, { FileWithPath } from 'react-dropzone';
import Plot from 'react-plotly.js';
import * as Plotly from 'plotly.js';
import 'bootstrap/dist/css/bootstrap.css';

function PlotApp() {
    const [data, setData] = useState<string[][] | null>(null);
    const [xColumn, setXColumn] = useState<string | null>(null);
    const [yColumn, setYColumn] = useState<string | null>(null);

    const handleDrop = (acceptedFiles: FileWithPath[]) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target?.result as string;
            const lines = content.split('\n').map((line) => line.split(','));

            // Assuming the first line contains column headers
            const columns = lines[0];

            setData(lines);
            setXColumn(columns[0]);
            setYColumn(columns[1]);
        };

        reader.readAsText(file);
    };

    const plotData = () => {
        if (!xColumn || !yColumn) {
            return null;
        }

        if (!data) {
            return null;
        }

        const xIndex = data[0].indexOf(xColumn);
        const yIndex = data[0].indexOf(yColumn);

        if (xIndex === -1 || yIndex === -1) {
            return null;
        }

        const xValues = data.slice(1).map((row) => parseFloat(row[xIndex]));
        const yValues = data.slice(1).map((row) => parseFloat(row[yIndex]));

        return [
            {
                x: xValues,
                y: yValues,

                type: 'scatter',
                mode: 'lines+markers',
                marker: { color: 'blue' },
                line: { shape: 'linear' },
            },
        ];
    };

    const plotDataResult = plotData();



    return (
        <div className="container">
            <h1 className="mt-5 mb-4">Data Plotter</h1>
            <div className="row">
                <div className="col-md-6">
                    <Dropzone onDrop={handleDrop}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()} className="dropzone">
                                <input {...getInputProps()} className="d-none" />
                                <button className="btn btn-success">
                                    Upload CSV File
                                </button>
                                <p className="mt-2">
                                    Drag & drop a CSV file here, or click to select one.
                                </p>
                            </div>
                        )}
                    </Dropzone>
                </div>
                <div className="col-md-3">
                    <label htmlFor="xAxisSelect" className="form-label">
                        Select X-axis:
                    </label>
                    <select
                        id="xAxisSelect"
                        className="form-select"
                        onChange={(e) => setXColumn(e.target.value)}
                    >
                        {data &&
                            data[0].map((column, index) => (
                                <option key={index} value={column}>
                                    {column}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <label htmlFor="yAxisSelect" className="form-label">
                        Select Y-axis:
                    </label>
                    <select
                        id="yAxisSelect"
                        className="form-select"
                        onChange={(e) => setYColumn(e.target.value)}
                    >
                        {data &&
                            data[0].map((column, index) => (
                                <option key={index} value={column}>
                                    {column}
                                </option>
                            ))}
                    </select>
                </div>
            </div>
            {data && plotDataResult ? (
                <div className="plot mt-4">
                    <Plot
                        data={plotDataResult as Plotly.Data[]}
                        layout={{ title: `${xColumn} vs. ${yColumn}` }}
                    />
                </div>
            ) : (
                <p className="mt-4">No data available for plotting.</p>
            )}
        </div>
    );
}

export default PlotApp;
