import { execSync } from "child_process";

import familyConfig
    from "../src/config/family.config.js";

function getRemoteUrl() {

    try {

        return execSync(
            "git remote get-url origin",
            {
                encoding: "utf8",
                stdio: [
                    "ignore",
                    "pipe",
                    "ignore"
                ]
            }
        ).trim();

    }
    catch {

        return "";

    }

}


function getRepoName(remoteUrl) {

    if (!remoteUrl) {
        return "";
    }

    const cleaned =
        remoteUrl
            .replace(/\.git$/i, "")
            .replace(/\\/g, "/");


    const match =
        cleaned.match(
            /\/([^/]+)$/
        );


    if (match) {
        return match[1];
    }


    /*
      SSH dạng:
      git@github.com:user/repo
    */

    const sshMatch =
        cleaned.match(
            /:([^/]+)$/
        );


    return sshMatch
        ? sshMatch[1]
        : "";

}


const remoteUrl =
    getRemoteUrl();

const repoName =
    getRepoName(
        remoteUrl
    );

const basePath =
    String(
        familyConfig
            .deployment
            ?.basePath ||
        "/"
    );


console.log("");
console.log(
    "KIỂM TRA DEPLOY GITHUB PAGES"
);
console.log(
    "============================"
);

console.log(
    `Website    : ${familyConfig.siteTitle}`
);

console.log(
    `familyCode : ${familyConfig.familyCode}`
);

console.log(
    `basePath   : ${basePath}`
);


if (!remoteUrl) {

    console.log("");
    console.warn(
        "⚠ Chưa tìm thấy Git remote 'origin'."
    );

    console.warn(
        "  Cần tạo repo GitHub và gắn remote trước lần publish đầu tiên."
    );

    process.exit(0);

}


console.log(
    `origin     : ${remoteUrl}`
);

console.log(
    `repo       : ${repoName}`
);


// ======================================
// CHECK BASE PATH
// ======================================

if (repoName) {

    const expected =
        `/${repoName}/`;


    /*
      Trường hợp GitHub user/organization Pages:
      username.github.io
      thì basePath có thể là /
    */

    const isRootPagesRepo =
        repoName
            .toLowerCase()
            .endsWith(
                ".github.io"
            );


    if (
        isRootPagesRepo
    ) {

        if (
            basePath !== "/"
        ) {

            console.log("");
            console.warn(
                `⚠ Repo ${repoName} thường nên dùng basePath: '/'`
            );

        }

    }
    else if (
        basePath !== expected
    ) {

        console.log("");
        console.warn(
            "⚠ basePath chưa khớp tên repository."
        );

        console.warn(
            `  Hiện tại : ${basePath}`
        );

        console.warn(
            `  Nên dùng : ${expected}`
        );

        console.warn(
            "  Hãy sửa src/config/family.config.js trước khi deploy."
        );

        process.exit(1);

    }

}


console.log("");
console.log(
    "✓ Cấu hình deploy cơ bản hợp lệ."
);
console.log("");
