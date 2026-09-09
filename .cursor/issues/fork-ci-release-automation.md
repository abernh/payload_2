# Fork CI gate and tag-based GitHub Releases

**Status:** deferred (not current priority)  
**Plan:** [`.cursor/plans/fork-ci-release-automation.plan.md`](../plans/fork-ci-release-automation.plan.md)

## Intent

Retarget the inherited PR CI to `main_v2`, add local `verify` / `verify:full` mirrors, run E2E against built Payload `dist`, and publish `payload@*` tags as GitHub Releases with dual tarballs plus reviewed notes under `releases/`.

## Out of scope for now

Do not implement until this issue is picked up. Keep the plan as the detailed SoT for that work.
