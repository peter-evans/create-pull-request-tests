const { inspect } = require("util");
const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const inputs = {
      token: core.getInput("token"),
      repository: core.getInput("repository")
    };
    core.debug(`Inputs: ${inspect(inputs)}`);

    const repository = inputs.repository ? inputs.repository : process.env.GITHUB_REPOSITORY;
    const repo = repository.split("/");
    core.debug(`Repo: ${inspect(repo)}`);

    const octokit = new github.GitHub(inputs.token);

    const { data: pulls } = await octokit.pulls.list({
      owner: repo[0],
      repo: repo[1],
      state: "open"
    });
    core.debug(`Pulls: ${inspect(pulls)}`);

    for (const pull of pulls) {
      const pull_number = pull["number"];
      core.debug(`Pull request number: ${pull_number}`);
      const ref = "heads/" + pull["head"]["ref"];
      core.debug(`Pull request head ref: ${ref}`);

      await octokit.pulls.update({
        owner: repo[0],
        repo: repo[1],
        pull_number,
        state: "closed"
      });

      await octokit.git.deleteRef({
        owner: repo[0],
        repo: repo[1],
        ref
      });
    }
  } catch (error) {
    core.debug(inspect(error));
    core.setFailed(error.message);
  }
}

run();
