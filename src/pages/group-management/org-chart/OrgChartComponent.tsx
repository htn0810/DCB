import "./OrgChartComponent.scss";
import React, {Fragment, useEffect, useState} from "react";
import {Card, CardContent, Divider, Tooltip} from "@mui/material";
import {ArrowDropUp, Info, Person} from "@mui/icons-material";
import {useAppDispatch, useAppSelector} from "../../../custom-hooks/hook";
import {hideIndicator, showIndicator} from "../../../app/app.slice";
import Tree from "react-d3-tree";
import {RawNodeDatum} from "react-d3-tree/lib/types/types/common";
import {Employee} from "../../../models/Employee";
import {UnitApi} from "../../../api/unit.api";
import {EmployeeAPI} from "../../../api/employee.api";
import InfoEmployeeTableDialog from "./info-employee-table-dialog/InfoEmployeeTableDialog";
import NotifyEndpointOrgLayerSnackbar from "./notify-endpoint-orglayer-snackbar/NotifyEndpointOrglayerSnackbar";
import { useLocation } from "react-router-dom";

function OrgChartComponent() {
    const [currentTreeData, setCurrentTreeData] = useState<RawNodeDatum[] | RawNodeDatum | null>(null);
    const [currentNodeId, setCurrentNodeId] = useState<number>();
    const [previousTreeData, setPreviousTreeData] = useState<RawNodeDatum[] | RawNodeDatum | null>(null);
    const [previousNodeId, setPreviousNodeId] = useState<number>();
    const nodeSize = {x: 320, y: 480};
    const foreignObjectProps = {
        width: nodeSize.x,
        height: nodeSize.y,
        x: -160,
        y: -100,
    };
    const [godFatherNodeId, setGodFatherNodeId] = useState<number>();
    const [employees, setEmployees] = useState<Employee[] | null>(null);
    const [infoTableDialogOpened, setInfoTableDialogOpened] = useState(false);
    const [notifySnackbarOpened, setNotifySnackbarOpened] = useState(false);
    const account = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();
    const location = useLocation();

    useEffect(() => {
        if (currentTreeData === null) {
            showNodeGodFather();
        }
    }, [account, currentTreeData])

    const showNodeGodFather = () => {
         dispatch(showIndicator())
            UnitApi.getUnitById(location.state?.id, true).then(res => {
                setGodFatherNodeId(res.id);
                setCurrentNodeId(res.id);
                setCurrentTreeData(
                    {
                        name: res.name,
                        attributes: {
                            id: res.id!,
                            manager: res.manager ? res.manager.fullName : "None-manager",
                            description: res.description ? res.description : "Empty-description",
                            haveChild: false,
                            totalEmployees: res.totalEmployeesOfEachLevel
                        },
                        children: []
                    }
                )
                dispatch(hideIndicator())
            })
    }

    const handleTurnDownwardToLowerNode = (node: any, toggleNode: () => void) => {
        if (!node.attributes.haveChild) {
            dispatch(showIndicator())
            UnitApi.getAllUnits({parentId: node.attributes.id}).then(res => {
                if (res.length === 0) {
                    setNotifySnackbarOpened(true);
                } else {
                    setPreviousNodeId(currentNodeId)
                    setPreviousTreeData(currentTreeData)
                    setCurrentNodeId(node.attributes.id)
                    setCurrentTreeData(
                        {
                            name: node.name,
                            attributes: {
                                id: node.attributes.id,
                                manager: node.attributes.manager || "None-manager",
                                description: node.attributes.description,
                                haveChild: true,
                                totalEmployees: node.attributes.totalEmployees
                            },
                            children: res.map((subGroup: any) => {
                                return {
                                    name: subGroup.name,
                                    attributes: {
                                        id: subGroup.id,
                                        manager: subGroup.manager ? subGroup.manager.fullName : "None-manager",
                                        description: subGroup.description,
                                        haveChild: false,
                                        totalEmployees: subGroup.totalCountEmployeesOfEachLevel
                                    },
                                    children: []
                                };
                            })
                        }
                    )
                    toggleNode()
                }
                dispatch(hideIndicator())
            })
        } else if (node.attributes.id !== currentNodeId && node.attributes.id !== previousNodeId) {
            setNotifySnackbarOpened(true);
        }
    }

    const handleTurnBackwardToHigherNode = (node: any, toggleNode: () => void) => {
        if (currentTreeData !== previousTreeData && previousTreeData !== null) {
            setCurrentNodeId(previousNodeId)
            setCurrentTreeData(previousTreeData)
        } else {
            if (currentNodeId === godFatherNodeId) {
                showNodeGodFather();
            } else {
                setPreviousTreeData(null)
                dispatch(showIndicator())
                UnitApi.getFamilyUnitsBySelfId(node.attributes.id).then((res: any) => {
                    setCurrentNodeId(res.id)
                    setCurrentTreeData(
                        {
                            name: res.name,
                            attributes: {
                                id: res.id,
                                manager: res.manager ? res.manager.fullName : "None-manager",
                                description: res.description,
                                haveChild: true,
                                totalEmployees: res.totalCountEmployeesOfEachLevel
                            },
                            children: res.children.map((child: any) => {
                                return {
                                    name: child.name,
                                    attributes: {
                                        id: child.id,
                                        manager: child.manager ? child.manager.fullName : "None-manager",
                                        description: child.description,
                                        haveChild: false,
                                        totalEmployees: child.totalCountEmployeesOfEachLevel
                                    },
                                    children: []
                                };
                            })
                        }
                    )
                    toggleNode()
                    dispatch(hideIndicator())
                })
            }
            
        }
    }

    const handleDropDownEmployeeOfGroup = (event: React.MouseEvent, node: any) => {
        event.stopPropagation()
        dispatch(showIndicator())
        EmployeeAPI.getEmployeesByUnitId(node.attributes.id!).then(res => {
            setEmployees(res)
            setInfoTableDialogOpened(true)
            dispatch(hideIndicator())
        })
    }

    const onCloseMgmtDialog = () => {
        setEmployees(null);
        setInfoTableDialogOpened(false);
    };

    // @ts-ignore
    const renderForeignObjectNode = ({nodeDatum, toggleNode, foreignObjectProps}) => {
        return (
            <foreignObject {...foreignObjectProps}>
                {(nodeDatum.children.length > 0) ?
                    <ArrowDropUp className="arrow-icon"
                                 onClick={() => handleTurnBackwardToHigherNode(nodeDatum, toggleNode)}/>
                    : null}
                <Card className="group-card" onClick={() => handleTurnDownwardToLowerNode(nodeDatum, toggleNode)}>
                    <CardContent style={{padding: "18px 36px 18px", marginBottom: "12px"}}>
                        <div className="group-name">
                            {nodeDatum.name}
                        </div>
                        <Divider sx={{borderBottomWidth: 3.5}}/>
                        {nodeDatum.attributes ?
                            <Fragment>
                                <div className="group-manager">{nodeDatum.attributes.manager}</div>
                                <div className="group-description">{nodeDatum.attributes.description}</div>
                                <Tooltip title="Click to see employees">
                                    <Info className="detail-icon"
                                          onClick={(event) => handleDropDownEmployeeOfGroup(event, nodeDatum)}/>
                                </Tooltip>
                                <Tooltip title={'Total employee: ' + nodeDatum.attributes.totalEmployees}>
                                    <Person className="person-icon"
                                            onClick={(event) => event.stopPropagation()}/>
                                </Tooltip>
                            </Fragment>
                        : null}
                    </CardContent>
                </Card>
            </foreignObject>
        )
    }

    return (
        <section className="org-chart-container">
            {currentTreeData &&
                <Tree data={currentTreeData}
                      initialDepth={1} zoom={0.5}
                      pathFunc="step" orientation="vertical"
                      enableLegacyTransitions={true}
                      separation={{siblings: 2, nonSiblings: 2}}
                      translate={{x: 550, y: 250}} nodeSize={{x: 180, y: 280}}
                      renderCustomNodeElement={rd3tProps =>
                          renderForeignObjectNode({...rd3tProps, foreignObjectProps})
                      }/>
            }

            <NotifyEndpointOrgLayerSnackbar open={notifySnackbarOpened}
                                            onClose={() => setNotifySnackbarOpened(false)}/>
            <InfoEmployeeTableDialog open={infoTableDialogOpened} onClose={onCloseMgmtDialog} employees={employees}/>
        </section>
    );
}

export default OrgChartComponent;
