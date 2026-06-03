// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title BaseSplitVaultLockList
/// @notice Minimal sequential checklist progress contract for Base mini apps.
/// @dev Slot copy lives in the frontend. The contract only stores user progress.
contract BaseSplitVaultLockList {
    uint256 public constant TOTAL_SLOTS = 5;
    string public constant APP_ID = "app-lock-list";

    struct ProgressSummary {
        bool exists;
        uint256 completedCount;
        uint256 pendingCount;
        uint256 totalSlots;
        uint256 progressBps;
        uint256 activeSlotId;
    }

    mapping(address => uint256) private _completedCount;
    mapping(address => mapping(uint256 => bytes32)) private _proofs;
    mapping(address => bool) private _hasProgress;

    event SlotCompleted(address indexed user, uint256 indexed slotId, bytes32 proofHash, uint256 completedCount);

    error SlotNotFound();
    error SlotNotActive();
    error SlotAlreadyCompleted();
    error VaultAlreadyComplete();

    function totalSlots() external pure returns (uint256) {
        return TOTAL_SLOTS;
    }

    function hasProgressRecord(address user) external view returns (bool) {
        return _hasProgress[user];
    }

    function getUserProgress(address user) external view returns (ProgressSummary memory) {
        return _progressSummary(user);
    }

    function readProgress(address user) external view returns (ProgressSummary memory) {
        return _progressSummary(user);
    }

    function completedCount(address user) external view returns (uint256) {
        return _completedCount[user];
    }

    function pendingCount(address user) external view returns (uint256) {
        uint256 completed = _completedCount[user];
        return completed >= TOTAL_SLOTS ? 0 : TOTAL_SLOTS - completed;
    }

    function progressPercentage(address user) external view returns (uint256) {
        return (_completedCount[user] * 100) / TOTAL_SLOTS;
    }

    function progressBps(address user) external view returns (uint256) {
        return (_completedCount[user] * 10_000) / TOTAL_SLOTS;
    }

    function activeSlotId(address user) public view returns (uint256) {
        uint256 nextSlotId = _completedCount[user] + 1;
        return nextSlotId > TOTAL_SLOTS ? 0 : nextSlotId;
    }

    function proofFor(address user, uint256 slotId) external view returns (bytes32) {
        if (!_slotExists(slotId)) revert SlotNotFound();
        return _proofs[user][slotId];
    }

    function canCompleteSlot(address user, uint256 slotId) public view returns (bool) {
        return _slotExists(slotId) && slotId == activeSlotId(user) && _proofs[user][slotId] == bytes32(0);
    }

    function completeActiveSlot(bytes32 proofHash) external returns (uint256 completedSlotId) {
        completedSlotId = activeSlotId(msg.sender);
        if (completedSlotId == 0) revert VaultAlreadyComplete();
        _completeSlot(completedSlotId, proofHash);
    }

    function completeSlot(uint256 slotId, bytes32 proofHash) external {
        if (!_slotExists(slotId)) revert SlotNotFound();
        if (_proofs[msg.sender][slotId] != bytes32(0)) revert SlotAlreadyCompleted();
        if (slotId != activeSlotId(msg.sender)) revert SlotNotActive();
        _completeSlot(slotId, proofHash);
    }

    function _completeSlot(uint256 slotId, bytes32 proofHash) private {
        bytes32 finalProofHash = proofHash == bytes32(0)
            ? keccak256(abi.encodePacked(APP_ID, msg.sender, slotId, block.chainid, block.number))
            : proofHash;

        _proofs[msg.sender][slotId] = finalProofHash;
        _completedCount[msg.sender] += 1;
        _hasProgress[msg.sender] = true;

        emit SlotCompleted(msg.sender, slotId, finalProofHash, _completedCount[msg.sender]);
    }

    function _progressSummary(address user) private view returns (ProgressSummary memory) {
        uint256 completed = _completedCount[user];
        uint256 pending = completed >= TOTAL_SLOTS ? 0 : TOTAL_SLOTS - completed;

        return ProgressSummary({
            exists: _hasProgress[user],
            completedCount: completed,
            pendingCount: pending,
            totalSlots: TOTAL_SLOTS,
            progressBps: (completed * 10_000) / TOTAL_SLOTS,
            activeSlotId: activeSlotId(user)
        });
    }

    function _slotExists(uint256 slotId) private pure returns (bool) {
        return slotId > 0 && slotId <= TOTAL_SLOTS;
    }
}
