import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';

import { initDataOfMeasureSheet } from '../../constants/variables';
import {
  updateWindowTable,
  updateTypeTable,
  updateMainTable,
} from '../../store/slices/measuresheetSlice';

import './style.css';

const tableHeaderLine = [
  'No.',
  'ROOM',
  'STYLE',
  'R.O.WIDTH',
  'R.O.HEIGHT',
  'ORDER WIDTH',
  'ORDER HEIGHT',
  'GRIDS/BLINDS',
  'INT COLOR',
  'EXT COLOR',
  'FOAM',
  'TEMP',
  'OBSC',
  'ENERGY',
  'MULL CUTS',
  'NOTES',
];
let data = {
  leftTable: {
    tearouts: 'WOOD',
    pockets: 'WOOD',
    cutbacks: '(-3/8") x (-1/2")',
  },
  rightTable: {
    grid: 'NO GRIDS',
    capping: 'BRICKMOLD',
  },
  mainTable: {},
};

for (let i = 0; i < 20; i++) {
  data.mainTable[i] = { ...initDataOfMeasureSheet, no: i + 1 };
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
  },
  table: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
  },
};

const MeasureSheet = () => {
  const salesInfo = useSelector((state) => state.salesInfo.data);
  const measuresheetData = useSelector((state) => state.measuresheet.data);
  const [openRightModal, setOpenRightModal] = useState(false);
  const [openLeftModal, setOpenLeftModal] = useState(false);
  const [openTableModal, setOpenTableModal] = useState(false);
  const [tempObj, setTempObj] = useState({});
  const [selectedRow, setSelectedRow] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateWindowTable({ ...data.leftTable }));
    dispatch(updateTypeTable({ ...data.rightTable }));
    // dispatch(updateMainTable({ ...data.mainTable }));
  }, []);

  const handleLeftModalOpen = () => {
    setOpenLeftModal(true);
  };

  const handleRightModalOpen = () => {
    setOpenRightModal(true);
  };

  const handleChangeWindowOption = (e) => {
    data.leftTable[e.target.id] = e.target.value;
    dispatch(updateWindowTable({ ...data.leftTable }));
  };

  const handleChangeTypeTable = (e) => {
    data.rightTable[e.target.id] = e.target.value;
    dispatch(updateTypeTable({ ...data.rightTable }));
  };

  const handleChangeInput = (e) => {
    setTempObj({ ...tempObj, [e.target.id]: e.target.value });
  };

  const handleClickTr = useCallback((row_id) => {
    setSelectedRow(row_id);
    setTempObj({ ...data.mainTable[row_id] });
    setOpenTableModal(true);
  }, []);

  const handleSave = () => {
    Object.keys(data.mainTable[selectedRow]).forEach((value) => {
      data.mainTable[selectedRow][value] = tempObj[value];
    });
    dispatch(updateMainTable(data.mainTable));
    setOpenTableModal(false);
  };

  const handleClear = () => {
    setTempObj({ ...initDataOfMeasureSheet, no: selectedRow + 1 });
  };

  const TableHeader = () => {
    return (
      <thead>
        <tr>
          {tableHeaderLine &&
            tableHeaderLine.map((value, index) => <th key={index}>{value}</th>)}
        </tr>
      </thead>
    );
  };

  const TableBody = () => {
    return (
      <tbody>
        {data.mainTable &&
          Object.values(measuresheetData.mainTable).map((ele, row_id) => (
            <tr key={row_id} onClick={() => handleClickTr(row_id)}>
              {Object.values(ele).map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
      </tbody>
    );
  };

  return (
    <div className="msh__container">
      <div className="msh__header">
        <div className="msh__header__left width-40">
          <div className="display-inline-block">
            <p className="msh-text text-center m-5">EXISTING WINDOWS</p>
            <div
              className="msh__hover-left-table"
              onClick={handleLeftModalOpen}
            >
              <table className="msh__header__left-table">
                <tr>
                  <td className="text-right">TYPE OF WINDOW TEAROUTS</td>
                  <td>{measuresheetData.windowTable.tearouts}</td>
                </tr>
                <tr>
                  <td className="text-right">TYPE OF WINDOW POCKET</td>
                  <td>{measuresheetData.windowTable.pockets}</td>
                </tr>
                <tr>
                  <td className="text-right">WINDOW CUTBACKS</td>
                  <td>{measuresheetData.windowTable.cutbacks}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <Modal
          isOpen={openLeftModal}
          style={customStyles.content}
          className="email-modal"
          overlayClassName="myoverlay"
          closeTimeoutMS={200}
        >
          <div>
            <label htmlFor="tearouts">TYPE OF WINDOW TEAROUTS</label>
            <select id="tearouts" onChange={(e) => handleChangeWindowOption(e)}>
              <option
                value="WOOD"
                selected={'WOOD' === data.leftTable.tearouts}
              >
                WOOD
              </option>
              <option
                value="ALUM"
                selected={'ALUM' === data.leftTable.tearouts}
              >
                ALUM
              </option>
              <option
                value="VINYL"
                selected={'VINYL' === data.leftTable.tearouts}
              >
                VINYL
              </option>
              <option
                value="STEEL"
                selected={'STEEL' === data.leftTable.tearouts}
              >
                STEEL
              </option>
            </select>
          </div>
          <div>
            <label htmlFor="pockets">TYPE OF WINDOW POCKET</label>
            <select id="pockets" onChange={(e) => handleChangeWindowOption(e)}>
              <option>WOOD</option>
              <option>PLASTER</option>
              <option>DRYWALL</option>
            </select>
          </div>
          <div>
            <label htmlFor="cutbacks">WINDOW CUTBACKS</label>
            <select id="cutbacks" onChange={(e) => handleChangeWindowOption(e)}>
              <option>(-3/8” W)</option>
              <option>(-1/2” W) x (-1/2 H)</option>
            </select>
          </div>
          <button onClick={() => setOpenLeftModal(false)}>close</button>
        </Modal>
        <div className="msh__header__center width-20 d-flex flex-direction-column justify-content-end">
          <p className="m-0">MEASURE SHEET</p>
        </div>
        <div className="msh__header__right width-40">
          <div className="flex">
            <div className="width-50">
              <div className="flex margin-top-30px">
                <div className="right-align width-30">Customer:</div>
                <div className="border-bottom width-70 blue-font">
                  {salesInfo.customer}
                </div>
              </div>
              <div className="flex margin-top-30px">
                <div className="right-align width-30">PO #:</div>
                <div className="border-bottom width-70 blue-font">
                  {salesInfo.po}
                </div>
              </div>
            </div>
            <div className="width-50">
              <div className="flex margin-top-30px">
                <div className="right-align width-30">Sales Rep:</div>
                <div className="border-bottom width-70 blue-font">
                  {salesInfo.salesConsultant}
                </div>
              </div>
              <div className="flex margin-top-30px">
                <div className="right-align width-30">Date:</div>
                <div className="border-bottom width-70 blue-font">
                  {salesInfo.date}
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <table
              className="msh__header__right-table"
              onClick={handleRightModalOpen}
            >
              <tr>
                <td className="text-right">GRID STYLE</td>
                <td className="text-center">
                  {measuresheetData.typeTable.grid}
                </td>
              </tr>
              <tr>
                <td className="text-right">CAPPING STYLE</td>
                <td className="text-center">
                  {measuresheetData.typeTable.capping}
                </td>
              </tr>
            </table>
          </div>
        </div>
        <Modal
          isOpen={openRightModal}
          style={customStyles.content}
          className="email-modal"
          overlayClassName="myoverlay"
          closeTimeoutMS={200}
        >
          <div>
            <label htmlFor="grid">GRID STYLE</label>
            <select id="grid" onChange={(e) => handleChangeTypeTable(e)}>
              <option value="NO GRIDS">NO GRIDS</option>
              <option value="Flat">Flat</option>
              <option value="Sculptured">Sculptured</option>
              <option value="SDL">SDL</option>
            </select>
          </div>
          <div>
            <label htmlFor="capping">CAPPING STYLE</label>
            <select id="capping" onChange={(e) => handleChangeTypeTable(e)}>
              <option value="BRICKMOLD">BRICKMOLD</option>
              <option value="1x4">1x4</option>
              <option value="1x6">1x6</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
          <button onClick={() => setOpenRightModal(false)}>close</button>
        </Modal>
      </div>
      <div className="msh__body">
        <table className="msh__body-table">
          <TableHeader />
          <TableBody />
        </table>
      </div>
      <Modal
        isOpen={openTableModal}
        style={customStyles.table}
        className="email-modal"
        overlayClassName="myoverlay"
        closeTimeoutMS={200}
      >
        {Object.keys(initDataOfMeasureSheet) &&
          Object.keys(initDataOfMeasureSheet).map((val, index) => (
            <div key={index}>
              <label htmlFor={val}>{val}</label>
              <input
                id={val}
                value={tempObj[val]}
                onChange={(e) => handleChangeInput(e)}
              />
            </div>
          ))}
        <button onClick={handleSave}>Save</button>
        <button onClick={handleClear}>Clear</button>
        <button onClick={() => setOpenTableModal(false)}>Close</button>
      </Modal>
    </div>
  );
};

export default MeasureSheet;
