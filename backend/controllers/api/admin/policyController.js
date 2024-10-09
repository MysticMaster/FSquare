import TermsAndPolicies from "../../../models/termsAndPolicies.js";
import {responseBody} from "../../../utils/generate.js";
import {
    badRequestResponse,
    notFoundResponse,
    conflictResponse,
    successResponse,
    createdResponse,
    internalServerErrorResponse,
    forbiddenResponse
} from "../../../utils/httpStatusCode.js";

const getTermsAndPolicies = async (req, res) => {
    const user = req.user;
    if (user.authority !== 'superAdmin') return res.status(forbiddenResponse.code).send(responseBody(forbiddenResponse.status, 'Access denied, you are not super admin'));
    try {
        const policies = await TermsAndPolicies.find();
        if (!policies || policies.length === 0) {
            const policy = await TermsAndPolicies.create();
            return res.status(successResponse.code)
                .json(responseBody(successResponse.status,
                    'Get Policies Successfully',
                    policy));
        }
        res.status(successResponse.code)
            .json(responseBody(successResponse.status,
                'Get Policies Successfully',
                policies[0]));
    } catch (error) {
        console.log(`getTermsAndPolicies ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
}

const updatePolicy = async (req, res) => {
    const user = req.user;
    if (user.authority !== 'superAdmin') {
        return res.status(forbiddenResponse.code)
            .json(responseBody(forbiddenResponse.status, 'Access denied, you are not super admin'));
    }

    const {contents} = req.body;
    if (!contents || contents.length === 0) {
        return res.status(badRequestResponse.code)
            .json(responseBody(badRequestResponse.status, 'Contents are required'));
    }

    try {
        const policy = await TermsAndPolicies.findById(req.params.id)
            .select('_id contents version');

        if (!policy) {
            return res.status(notFoundResponse.code)
                .json(responseBody(notFoundResponse.status, 'Policies not found'));
        }

        const newContents = contents.filter(newContent =>
            !policy.contents.some(existingContent => existingContent.content === newContent.content)
        );

        if (newContents.length === 0) {
            return res.status(conflictResponse.code)
                .json(responseBody(conflictResponse.status, 'All contents already exist'));
        }

        policy.contents.push(...newContents);
        policy.version += 1;

        await policy.save();

        res.status(successResponse.code)
            .json(responseBody(successResponse.status, 'Contents updated successfully', policy));
    } catch (error) {
        console.log(`updatePolicy Error: ${error.message}`);
        res.status(internalServerErrorResponse.code)
            .json(responseBody(internalServerErrorResponse.status, 'Server error'));
    }
};

export default {
    getTermsAndPolicies,
    updatePolicy
}
