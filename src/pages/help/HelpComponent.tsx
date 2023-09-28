import "./HelpComponent.scss";
import React from "react";
import {Link} from "react-router-dom";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Toolbar,
    Typography
} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";

export default function HelpComponent() {

    const USER_GUIDE_ROWS = [
        {
            version: 'User Guide',
            file: 'https://inside-docupedia.bosch.com/confluence/download/attachments/3024537516/DigiCore_features.pdf'
        },
        {
            version: 'API Document',
            file: 'https://inside-docupedia.bosch.com/confluence/download/attachments/3024537516/DigiCore_APIs.pdf'
        }
    ];

    const RELEASE_ROWS = [
        {
            version: 'Version 1.3',
            file: 'https://inside-docupedia.bosch.com/confluence/download/attachments/3012882093/DigiCore_v1.3_ReleaseNotes.pdf'
        },
        {
            version: 'Version 1.2',
            file: 'https://inside-docupedia.bosch.com/confluence/download/attachments/3012882093/DigiCore_v1.2_ReleaseNotes.pdf'
        },
        {
            version: 'Version 1.1',
            file: 'https://inside-docupedia.bosch.com/confluence/download/attachments/3012882093/DigiCore_v1.1_ReleaseNotes.pdf'
        }
    ];

    const CONTACT_ROWS = [
        {
            name: 'DigiCore Team',
            role: '',
            email: 'Huy.NguyenAnh@vn.bosch.com; Nguyen.NguyenHongSy@vn.bosch.com; Tri.HoangPhamMinh@vn.bosch.com; ' +
                'fixed-term.Bao.NguyenThe@vn.bosch.com; fixed-term.Nhan.HuynhThanh@vn.bosch.com'
        },
        {
            name: 'Nguyen Anh Huy',
            role: 'Project Manager',
            email: 'Huy.NguyenAnh@vn.bosch.com'
        },
        {
            name: 'Nguyen Hong Sy Nguyen',
            role: 'Developer',
            email: 'Nguyen.NguyenHongSy@vn.bosch.com'
        },
        {
            name: 'Hoang Pham Minh Tri',
            role: 'Developer',
            email: 'Tri.HoangPhamMinh@vn.bosch.com'
        },
        {
            name: 'Nguyen The Bao',
            role: 'Developer',
            email: 'fixed-term.Bao.NguyenThe@vn.bosch.com'
        },
        {
            name: 'Huynh Thanh Nhan',
            role: 'Developer',
            email: 'fixed-term.Nhan.HuynhThanh@vn.bosch.com'
        }
    ];

    const QUESTION_ROWS = [
        {
            question: 'What is DigiCore?',
            answer: 'DigiCore is the place where stored all information about applications, organizations, organization chart, employees.'
        },
        {
            question: 'What is the benefit of DigiCore ?',
            answer: 'DigiCore will help user to know more about chart of their organization and also help manager to control the information of their members.'
        }
    ];

    return (
        <section className="help-container">
            <Toolbar className="toolbar">
                <Typography variant="h5" style={{flexGrow: 1}}>
                    Help
                </Typography>
            </Toolbar>

            <Accordion defaultExpanded>
                <AccordionSummary>
                    <Typography variant="h6">
                        User Guide
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <div>
                            User guide where stored all introductions for each features of Digital Core.
                        </div>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>File Name</TableCell>
                                    <TableCell>Document Link</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {USER_GUIDE_ROWS.map(row =>
                                    <TableRow key={row.version}>
                                        <TableCell>
                                            {row.version}
                                        </TableCell>
                                        <TableCell>
                                            <Link to={row.file} target="_blank" download>
                                                Document
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary>
                    <Typography variant="h6">
                        Release Notes
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <div>
                            Release notes where stored new features of app for each released version.
                        </div>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="tableCell">Release version</TableCell>
                                    <TableCell className="tableCell">Release document</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {RELEASE_ROWS.map(row =>
                                    <TableRow key={row.version}>
                                        <TableCell className="tableCell">
                                            {row.version}
                                        </TableCell>
                                        <TableCell className="tableCell">
                                            <Link to={row.file} target="_blank" download>
                                                Release Notes
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary>
                    <Typography variant="h6">
                        Support / Responsible Persons
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        <div>
                            <i>Note: Please choose Outlook (or another mail app) as your default mail app to open mail template with the corresponding email directly.</i>
                        </div>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>EMail</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {CONTACT_ROWS.map((row, index) =>
                                    <TableRow key={row.name}>
                                        <TableCell>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            {row.name}
                                        </TableCell>
                                        <TableCell>
                                            {row.role}
                                        </TableCell>
                                        <TableCell>
                                            <Link to={"mailto:" + row.email + "?subject=Support required for DigiCore project"}>
                                                {row.name === "DigiCore Team" ? row.email = row.name : row.email}
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary>
                    <Typography  variant="h6">
                        Frequently Asked Questions
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {QUESTION_ROWS.map(row =>
                        <Accordion key={row.question} defaultExpanded>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography>
                                    <strong>{row.question}</strong>
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {row.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    )}
                </AccordionDetails>
            </Accordion>
        </section>
    )
}
